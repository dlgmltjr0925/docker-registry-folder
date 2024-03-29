import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';

import { CreateRegistryDto } from './dto/create-registry.dto';
import { DockerRegistryService } from '../docker-registry/docker-registry.service';
import { HostDuplicateException } from './exceptions/host-duplicate.exception';
import { RegistryDto } from './dto/registry.dto';
import { RegistryWithTokenDto } from './dto/registry-with-token.dto';
import { RepositoryDto } from './dto/repository.dto';
import { SyncService } from '../sync/sync.service';
import { UpdateRegistryDto } from './dto/update-registry.dto';
import { connect } from '../../lib/sqlite';
import dateFormat from 'dateformat';

@Injectable()
export class RegistryService {
  cryptoPassword;
  cipherKey;
  algorithm;
  iv;
  registries: RegistryDto[];

  logger = new Logger('RegistryService');

  constructor(private dockerRegistryService: DockerRegistryService, private syncService: SyncService) {
    this.cryptoPassword = Buffer.from(process.env.CRYPTO_PASSWORD as string);
    this.cipherKey = scryptSync(this.cryptoPassword, 'salt', 24);
    this.algorithm = 'aes-192-cbc';
    this.iv = Buffer.alloc(16, 0);
    this.registries = [];
  }

  encrypt(plainText: string): string {
    const cipher = createCipheriv(this.algorithm, this.cipherKey, this.iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encrypted: string): string {
    const decipher = createDecipheriv(this.algorithm, this.cipherKey, this.iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async create(createRegistryDto: CreateRegistryDto) {
    return new Promise<RegistryDto>((resolve, reject) => {
      const db = connect();
      try {
        const { name, host, username, password, tag } = createRegistryDto;
        const token = username && password ? Buffer.from(`${username}:${password}`).toString('base64') : null;
        const encryptedToken = token ? this.encrypt(token) : null;

        db.serialize(() => {
          let sql = `INSERT INTO registry (name, host, token, tag) VALUES (?, ?, ?, ?)`;
          db.run(sql, [name, host, encryptedToken, tag], (error) => {
            if (error) {
              if (error.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: registry.host')
                return reject(new HostDuplicateException());
              return reject(error);
            }
          });

          sql = `SELECT id, name, host, tag FROM registry WHERE name=? AND host=? AND ifnull(token, '')=? AND ifnull(tag, '')=? ORDER BY id DESC LIMIT 1`;
          db.each<any>(sql, [name, host, encryptedToken || '', tag || ''], (error, row) => {
            if (error) throw error;
            resolve(row);
          });
        });
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  findAll() {
    return new Promise<RegistryWithTokenDto[]>((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, name, host, tag, token FROM registry`;
        db.all<any>(sql, (error, rows) => {
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

  findAllByKeyword(keyword: string) {
    return new Promise<RegistryWithTokenDto[]>((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, name, host, tag, token FROM registry WHERE name LIKE ? OR host LIKE ? OR ifnull(tag, '') LIKE ?`;
        const likeKeyword = `%${keyword}%`;
        db.all<any>(sql, [likeKeyword, likeKeyword, likeKeyword], (error, rows) => {
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

  findOneById(id: number) {
    return new Promise<RegistryDto | null>((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, name, host, tag FROM registry WHERE id=?`;
        db.all<any>(sql, [id], (error, rows) => {
          if (error) return reject(error);
          if (rows.length === 0) return resolve(null);
          resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  findOneWithTokenById(id: number) {
    return new Promise<RegistryWithTokenDto | null>((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, name, host, tag, token FROM registry WHERE id=?`;
        db.all<any>(sql, [id], (error, rows) => {
          if (error) return reject(error);
          if (rows.length === 0) return resolve(null);
          resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  findOneWithAccessInfoById(id: number) {
    return new Promise<UpdateRegistryDto | null>((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, name, host, tag, token FROM registry WHERE id=?`;
        db.all<any>(sql, [id], (error, rows) => {
          if (error) return reject(error);
          if (rows.length === 0) return resolve(null);
          const { token, ...registry } = rows[0];
          if (token) {
            const decryptedToken = this.decrypt(token);
            const decodedToken = Buffer.from(decryptedToken, 'base64').toString('utf-8');
            const [username, password] = decodedToken.split(':');
            registry.username = username;
            registry.password = password;
          }
          resolve(registry);
        });
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  getRepositoriesByRegistryId(id: number) {
    return new Promise<RepositoryDto[]>((resolve, reject) => {
      const db = connect();
      try {
        const sql = `
        SELECT r.name AS name, IFNULL(GROUP_CONCAT(t.name, ':'), '') AS tags
        FROM repository r
        LEFT JOIN tag t
        ON r.id=t.repository_id
        WHERE registry_id=?
        GROUP BY r.name
        `;
        db.all(sql, [id], (error, rows: { name: string; tags: string }[]) => {
          if (error) throw error;
          const repositories = rows.map(({ name, tags }) => ({
            name,
            tags: tags.split(':'),
          }));
          resolve(repositories);
        });
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  update(updateRegistryDto: UpdateRegistryDto) {
    return new Promise<boolean>((resolve, reject) => {
      const db = connect();
      try {
        const { id, name, host, username, password, tag } = updateRegistryDto;
        const token = username && password ? Buffer.from(`${username}:${password}`).toString('base64') : null;
        const encryptedToken = token ? this.encrypt(token) : null;
        const updatedAt = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');

        let sql = `UPDATE registry SET name=?, host=?, token=?, tag=?, updated_at=? WHERE id=?`;
        db.run(sql, [name, host, encryptedToken, tag, updatedAt, id], (error) => {
          if (error) throw error;
          resolve(true);
        });
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  removeByIds(ids: string) {
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        const sql = `DELETE FROM registry WHERE id IN (${ids})`;
        db.run(sql, (error) => {
          if (error) return reject(error);
          resolve(true);
        });
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  async getRepositoriesByRegistry({ host, token: encryptedToken }: RegistryWithTokenDto): Promise<string[]> {
    try {
      const token = encryptedToken ? this.decrypt(encryptedToken) : null;
      const res = await this.dockerRegistryService.getRepositories({ host, token });
      if (res?.status === 200) {
        return res.data.repositories;
      }
      return [];
    } catch (error) {
      throw error;
    }
  }

  async getTagsByRegistryIdAndName(
    { host, token: encryptedToken }: RegistryWithTokenDto,
    name: string
  ): Promise<string[]> {
    try {
      const token = encryptedToken ? this.decrypt(encryptedToken) : null;
      const res = await this.dockerRegistryService.getTags({ host, token, name });
      if (res?.status === 200 && res.data.tags !== null) {
        return res.data.tags;
      }
      return [];
    } catch (error) {
      throw error;
    }
  }

  async getRegistriesWithRepositories(registries: RegistryWithTokenDto[]): Promise<RegistryDto[]> {
    return await Promise.all(
      registries.map(async (registry) => {
        return await this.getRegistryWithRepositories(registry);
      })
    );
  }

  async getRegistryWithRepositories({
    token: encryptedToken,
    ...registry
  }: RegistryWithTokenDto): Promise<RegistryDto> {
    try {
      registry.status = 'UP';
      const { host } = registry;
      const token = encryptedToken ? this.decrypt(encryptedToken) : null;
      const res = await this.dockerRegistryService.getRepositories({ host, token });
      if (res?.status === 200) {
        // Sync
        this.syncService.addRepositorySyncJob({ registryId: registry.id, repositories: res.data.repositories });

        registry.repositories = await Promise.all(
          res.data.repositories.map(async (name) => {
            const res = await this.dockerRegistryService.getTags({ host, token, name });
            let tags: string[] = [];
            if (res?.status === 200 && res.data.tags !== null) {
              tags = res.data.tags;

              // Sync
              this.syncService.addTagSyncJob({ registryId: registry.id, repository: name, tags });
            }
            return { name, tags };
          })
        );
      }
    } catch (error: any) {
      registry.status = 'DOWN';
      registry.repositories = await this.getRepositoriesByRegistryId(registry.id);
      registry.message = error.message;
    } finally {
      registry.checkedAt = new Date();
      return registry;
    }
  }
}
