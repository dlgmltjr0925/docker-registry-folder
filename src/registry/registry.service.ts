import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';
import dateFormat from 'dateformat';

import { Injectable } from '@nestjs/common';

import { connect } from '../../lib/sqlite';
import { DockerRegistryService } from '../docker-registry/docker-registry.service';
import { CreateRegistryDto } from './dto/create-registry.dto';
import { RegistryWithTokenDto } from './dto/registry-with-token.dto';
import { RegistryDto } from './dto/registry.dto';
import { UpdateRegistryDto } from './dto/update-registry.dto';
import { HostDuplicateException } from './exceptions/host-duplicate.exception';

@Injectable()
export class RegistryService {
  cryptoPassword;
  cipherKey;
  algorithm;
  iv;
  registries: RegistryDto[];

  constructor(private dockerRegistryService: DockerRegistryService) {
    this.cryptoPassword = Buffer.from(process.env.CRYPTO_PASSWORD as string);
    this.cipherKey = scryptSync(this.cryptoPassword, 'salt', 24);
    this.algorithm = 'aes-192-cbc';
    this.iv = Buffer.alloc(16, 0);
    console.log('iv', this.iv);
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
          db.each(sql, [name, host, encryptedToken || '', tag || ''], (error, row) => {
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
        db.all(sql, (error, rows) => {
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
        db.all(sql, [likeKeyword, likeKeyword, likeKeyword], (error, rows) => {
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
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, name, host, tag FROM registry WHERE id=?`;
        db.each(sql, [id], (error, row) => {
          if (error) return reject(error);
          resolve(row);
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
        db.all(sql, [id], (error, rows) => {
          if (error) return reject(error);
          if (rows.length === 0) resolve(null);
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

  async getRegistriesWithRepositories(registries: RegistryWithTokenDto[]): Promise<RegistryDto[]> {
    return await Promise.all(
      registries.map(async ({ token: encryptedToken, ...registry }) => {
        try {
          registry.status = 'UP';
          const { host } = registry;
          const token = encryptedToken ? this.decrypt(encryptedToken) : null;
          const res = await this.dockerRegistryService.getRepositories({ host, token });
          if (res?.status === 200) {
            registry.repositories = await Promise.all(
              res.data.repositories.map(async (name) => {
                const res = await this.dockerRegistryService.getTags({ host, token, name });
                let tags: string[] = [];
                if (res?.status === 200 && res.data.tags !== null) {
                  tags = res.data.tags;
                }
                return { name, tags };
              })
            );
          }
        } catch (error) {
          registry.status = 'DOWN';
          registry.repositories = [];
          registry.message = error.message;
        } finally {
          registry.checkedAt = new Date();
          return registry;
        }
      })
    );
  }
}
