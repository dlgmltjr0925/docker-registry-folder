import {
    CipherGCM, createCipheriv, createDecipheriv, DecipherGCM, randomBytes, scryptSync
} from 'crypto';
import dateFormat from 'dateformat';

import { Injectable } from '@nestjs/common';

import { connect } from '../../lib/sqlite';
import { DockerRegistryService } from '../docker-registry/docker-registry.service';
import { CreateRegistryDto } from './dto/create-registry.dto';
import { UpdateRegistryDto } from './dto/update-registry.dto';

@Injectable()
export class RegistryService {
  cryptoPassword;
  cipherKey;
  algorithm;
  iv;

  constructor(private dockerRegistryService: DockerRegistryService) {
    this.cryptoPassword = Buffer.from(process.env.CRYPTO_PASSWORD as string);
    this.cipherKey = scryptSync(this.cryptoPassword, 'salt', 32);
    this.algorithm = 'aes-256-gcm';
    this.iv = Buffer.alloc(16, 0);
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
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        const { name, host, username, password, tag } = createRegistryDto;
        const token = username && password ? Buffer.from(`${username}:${password}`).toString('base64') : null;
        const encryptedToken = token ? this.encrypt(token) : null;

        db.serialize(() => {
          let sql = `INSERT INTO registry (name, host, token, tag) VALUES (?, ?, ?, ?)`;
          db.run(sql, [name, host, encryptedToken, tag], (error) => {
            if (error) throw error;
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
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, name, host, tag FROM registry`;
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
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, name, host, tag FROM registry WHERE name LIKE ? OR host LIKE ? OR ifnull(tag, '') LIKE ?`;
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

  findOne(id: number) {
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

  update(id: number, updateRegistryDto: UpdateRegistryDto) {
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        const values = [];
        const elements = Object.entries(updateRegistryDto).map(([key, value]) => {
          values.push(value);
          return `${key}=?`;
        });
        values.push(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'));
        values.push(id);
        let sql = `UPDATE registry SET ${elements.join(', ')}, updated_at=? WHERE id=?`;
        db.run(sql, values, (error) => {
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

  remove(id: number) {
    return new Promise((resolve, reject) => {
      const db = connect();
      try {
        const sql = `DELETE FROM registry WHERE id=?`;
        db.run(sql, [id], (error) => {
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
}
