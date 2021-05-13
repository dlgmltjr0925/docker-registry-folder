import {
    CipherGCM, createCipheriv, createDecipheriv, DecipherGCM, randomBytes, scryptSync
} from 'crypto';

import { Injectable } from '@nestjs/common';

import { connect } from '../../lib/sqlite';
import { DockerRegistryService } from '../docker-registry/docker-registry.service';
import { CreateRegistryDto } from './dto/create-registry.dto';
import { UpdateRegistryDto } from './dto/update-registry.dto';

@Injectable()
export class RegistryService {
  cipher: CipherGCM;
  decipher: DecipherGCM;

  constructor(private dockerRegistryService: DockerRegistryService) {
    const cryptoPassword = Buffer.from(process.env.CRYPTO_PASSWORD as string);
    const cipherKey = scryptSync(cryptoPassword, 'salt', 32);
    const algorithm = 'aes-256-gcm';
    const iv = Buffer.alloc(16, 0);
    this.cipher = createCipheriv(algorithm, cipherKey, iv);
    this.decipher = createDecipheriv(algorithm, cipherKey, iv);
  }

  encrypt(plainText: string): string {
    let encrypted = this.cipher.update(plainText, 'utf8', 'hex');
    encrypted += this.cipher.final('hex');
    return encrypted;
  }

  decrypt(encrypted: string): string {
    let decrypted = this.decipher.update(encrypted, 'hex', 'utf8');
    decrypted += this.decipher.final('utf8');
    return decrypted;
  }

  async create(createRegistryDto: CreateRegistryDto) {
    return new Promise((resolve, reject) => {
      const { name, host, username, password, tag } = createRegistryDto;
      const token = username && password ? Buffer.from(`${username}:${password}`).toString('base64') : null;
      const encryptedToken = token ? this.encrypt(token) : null;

      const db = connect();
      db.serialize(() => {
        let sql = `INSERT INTO registry (name, host, token, tag) VALUES (?, ?, ?, ?)`;
        db.run(sql, [name, host, encryptedToken, tag], (res: any, error: any) => {
          console.log(res);
        });

        sql = `SELECT id, name, host, tag FROM registry WHERE name=? AND host=? AND ifnull(token, '')=? AND ifnull(tag, '')=? ORDER BY id DESC LIMIT 1`;
        db.each(sql, [name, host, encryptedToken || '', tag || ''], (error, row) => {
          console.log(error);
          if (error) return reject(error);
          resolve(row);
        });
      });
      db.close();
    });
  }

  findAll() {
    return `This action returns all registry`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registry`;
  }

  update(id: number, updateRegistryDto: UpdateRegistryDto) {
    return `This action updates a #${id} registry`;
  }

  remove(id: number) {
    return `This action removes a #${id} registry`;
  }
}
