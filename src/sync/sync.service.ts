import { Injectable, Logger } from '@nestjs/common';

import { DbDataDto } from './dto/db-data.dto';
import { RepositorySyncJobDto } from './dto/repository-sync-job.dto';
import { TagSyncJob } from './dto/tag-sync-job.dto';
import { connect } from '../../lib/sqlite';
import { resolve } from 'dns';

@Injectable()
export class SyncService {
  logger = new Logger('SyncService');

  repositorySyncJob: Record<number, string[]> = {};
  tagSyncJob: Record<string, string[]> = {};

  synchronizingRepository = false;
  synchronizingTag = false;

  addRepositorySyncJob({ registryId, repositories }: RepositorySyncJobDto) {
    this.repositorySyncJob[registryId] = repositories;
    setTimeout(() => {
      this.syncRepository();
    });
  }

  addTagSyncJob({ registryId, repository, tags }: TagSyncJob) {
    const key = `${registryId}-${repository}`;
    this.tagSyncJob[key] = tags;
    setTimeout(() => {
      this.syncTag();
    });
  }

  getRepositoriesByRegistryId(id: number): Promise<DbDataDto[]> {
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, name FROM repository WHERE registry_id=? ORDER BY name ASC`;
        db.all<any>(sql, [id], (error, rows) => {
          if (error) throw error;
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  getTagsByRepositoryId(id: number): Promise<DbDataDto[]> {
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, name FROM tag WHERE repository_id=? ORDER BY name ASC`;
        db.all<any>(sql, [id], (error, rows) => {
          if (error) throw error;
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  getRepositoryIdByRegistryIdAndName(registryId: number, name: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id FROM repository WHERE registry_id=? AND name=?`;
        db.all<any>(sql, [registryId, name], (error, rows) => {
          if (error) throw error;
          if (rows.length === 0) throw new Error('Not founded repository');
          resolve(rows[0].id);
        });
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  insertRepositories({ registryId, repositories }: RepositorySyncJobDto) {
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        db.serialize(() => {
          const sql = `INSERT INTO repository (registry_id, name) VALUES (?, ?)`;
          const stmt = db.prepare(sql);
          for (let i = 0; i < repositories.length; i++) {
            stmt.run(registryId, repositories[i]);
          }
          stmt.finalize((error) => {
            if (error) throw error;
          });
        });
        resolve(repositories.length);
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  deleteRepositories(ids: number[]) {
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        const sql = `DELETE FROM repository WHERE id IN (?)`;
        db.run(sql, [ids.join(',')], (error) => {
          if (error) throw error;
        });
        resolve(ids.length);
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  insertTags({ repositoryId, tags }: { repositoryId: number; tags: string[] }) {
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        db.serialize(() => {
          const sql = `INSERT INTO tag (repository_id, name) VALUES (?, ?)`;
          const stmt = db.prepare(sql);
          for (let i = 0; i < tags.length; i++) {
            stmt.run(repositoryId, tags[i]);
          }
          stmt.finalize((error) => {
            if (error) throw error;
          });
        });
        resolve(tags.length);
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  deleteTags(ids: number[]) {
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        const sql = `DELETE FROM tags WHERE id IN (?)`;
        db.run(sql, [ids.join(',')], (error) => {
          if (error) throw error;
        });
        resolve(ids.length);
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  compare(str1: string, str2: string): number {
    // Is Equal
    if (str1 === str2) return 0;
    // Ascending
    else if ([str1, str2].sort()[0] === str1) return 1;
    // Descending
    else return -1;
  }

  getNeedToUpdate(dbDatas: DbDataDto[], serverDatas: string[]) {
    let deletes: DbDataDto[] = [];
    let inserts: string[] = [];
    let i = 0;
    let j = 0;

    while (dbDatas[i] && serverDatas[j]) {
      const comp = this.compare(dbDatas[i].name, serverDatas[j]);
      if (comp === 0) {
        i++;
        j++;
      } else if (comp === 1) {
        deletes.push(dbDatas[i]);
        i++;
      } else {
        inserts.push(serverDatas[j]);
        j++;
      }
    }

    return {
      inserts: inserts.concat(serverDatas.slice(j)),
      deletes: deletes.concat(dbDatas.slice(i)),
    };
  }

  async syncRepository() {
    if (this.synchronizingRepository) return;
    this.synchronizingRepository = true;

    const queue: RepositorySyncJobDto[] = Object.entries(this.repositorySyncJob).map(([registryId, repositories]) => ({
      registryId: +registryId,
      repositories,
    }));

    if (queue.length === 0) return;

    while (queue.length) {
      try {
        const { registryId, repositories } = queue.shift() as RepositorySyncJobDto;
        repositories.sort();
        const dbRepositories = await this.getRepositoriesByRegistryId(registryId);

        const { inserts, deletes } = this.getNeedToUpdate(dbRepositories, repositories);

        try {
          if (inserts.length > 0) {
            const count = await this.insertRepositories({ registryId, repositories: inserts });
            inserts.forEach((name) => {
              this.logger.log(`Synchronized repository {${name}} is added.`);
            });
          }
        } catch (error) {
          this.logger.error(error);
        }

        try {
          const ids = deletes.map(({ id }) => id);
          if (ids.length > 0) {
            this.deleteRepositories(ids);
            deletes.forEach(({ name }) => {
              this.logger.log(`Synchronized repository {${name}} is removed.`);
            });
          }
        } catch (error) {
          this.logger.error(error);
        }
      } catch (error) {
        this.logger.error(error);
      }
    }

    //
    this.synchronizingRepository = false;
  }

  async syncTag() {
    if (this.synchronizingTag) return;
    this.synchronizingTag = true;

    const queue: TagSyncJob[] = Object.entries(this.tagSyncJob).map(([key, tags]) => {
      const [registryId, ...repository] = key.split('-');
      return {
        registryId: +registryId,
        repository: repository.join('-'),
        tags,
      };
    });

    if (queue.length === 0) return;

    while (queue.length) {
      try {
        const { registryId, repository, tags } = queue.shift() as TagSyncJob;
        tags.sort();
        const repositoryId = await this.getRepositoryIdByRegistryIdAndName(registryId, repository);
        const dbTags = await this.getTagsByRepositoryId(repositoryId);

        const { inserts, deletes } = this.getNeedToUpdate(dbTags, tags);

        try {
          if (inserts.length > 0) {
            const count = await this.insertTags({ repositoryId, tags: inserts });
            inserts.forEach((name) => {
              this.logger.log(`Synchronized tag {${repository}:${name}} is added.`);
            });
          }
        } catch (error) {
          this.logger.error(error);
        }

        try {
          const ids = deletes.map(({ id }) => id);
          if (ids.length > 0) {
            this.deleteTags(ids);
            deletes.forEach(({ name }) => {
              this.logger.log(`Synchronized tag {${repository}:${name}} is removed.`);
            });
          }
        } catch (error) {
          this.logger.error(error);
        }
      } catch (error) {
        this.logger.error(error);
      }
    }

    //
    this.synchronizingTag = false;
  }
}
