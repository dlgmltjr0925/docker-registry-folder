import * as bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { connect } from '../../utils/sqlite';
import { JwtPayload } from './dto/jwt-payload.dto';
import { SignInInputDto } from './dto/sign-in-input.dto';
import { SignUpInputDto } from './dto/sign-up-input.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  systemAdmin: boolean = false;
  salt: string | null = null;
  jwtSecret: string | null = null;
  constructor(private jwtService: JwtService) {}

  async getSalt(): Promise<string> {
    if (this.salt === null) {
      const saltPath = path.resolve('data/salt');
      this.salt = fs.readFileSync(saltPath, 'binary');
    }
    return this.salt;
  }

  async getJwtSecret(): Promise<string> {
    if (this.jwtSecret === null) {
      const jwtSecretPath = path.resolve('data/jwt-secret');
      this.jwtSecret = fs.readFileSync(jwtSecretPath, 'binary');
    }
    return this.jwtSecret;
  }

  async hasSystemAdmin(): Promise<boolean> {
    if (this.systemAdmin) return true;
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM user WHERE system_admin=1 LIMIT 1`;
      const db = connect();
      db.all(sql, (error, rows) => {
        if (error) return reject(error);
        this.systemAdmin = rows.length === 1;
        resolve(this.systemAdmin);
      });
      db.close();
    });
  }

  async validateUser({ username, password }: SignInInputDto): Promise<UserDto | null> {
    const hashedPassword = await bcrypt.hash(password, await this.getSalt());
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, username, role, system_admin FROM user WHERE username=? AND password=? LIMIT 1`;
      const db = connect();
      db.all(sql, [username, hashedPassword], (error, rows) => {
        if (error) return reject(error);
        if (rows.length === 0) resolve(null);
        else {
          const { id, username, role, system_admin: systemAdmin } = rows[0];
          resolve({
            id,
            username,
            role,
            systemAdmin,
          });
        }
      });
      db.close();
    });
  }

  async issueAccessToken({ id, username, role, systemAdmin }: UserDto): Promise<string> {
    const payload: JwtPayload = {
      sub: id,
      username,
      role,
      systemAdmin,
    };
    return this.jwtService.sign(payload, { secret: await this.getJwtSecret() });
  }

  async signUp({ username, password, role, systemAdmin }: SignUpInputDto): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, await this.getSalt());
    return new Promise((resolve, reject) => {
      const db = connect();
      let sql: string;
      db.serialize(() => {
        /**
         * Check the presence or absence of system admin
         */
        if (systemAdmin) {
          sql = `SELECT EXISTS (SELECT * FROM user WHERE system_admin=1) as user`;
          db.each(sql, (error, row) => {
            if (error) return reject(error);
            else if (row.user === 1) {
              return reject(new BadRequestException('Only one system administrator can be registered'));
            }
          });
        }
        /**
         * Check duplicated username
         */
        sql = `SELECT EXISTS (SELECT * FROM user WHERE username=?) as user`;
        db.each(sql, [username], (error, row) => {
          if (error) return reject(error);
          else if (row.user === 1) return reject(new BadRequestException('Already registered'));
        });
        /**
         * Insert user information
         */
        sql = `INSERT INTO user (username, password, role, system_admin) VALUES (?, ?, ?, ?)`;
        db.run(sql, [username, hashedPassword, role, systemAdmin], (res: any, error: any) => {
          if (error) return reject(error);
        });
        /**
         * Get a created user information
         */
        sql = `SELECT id, username, role, system_admin FROM user WHERE username=? AND password=?`;
        db.each(sql, [username, hashedPassword], async (error, row) => {
          if (error) return reject(error);
          const { id, username, role, system_admin: systemAdmin } = row;
          const payload: JwtPayload = {
            sub: id,
            username,
            role,
            systemAdmin,
          };
          resolve(this.jwtService.sign(payload, { secret: await this.getJwtSecret() }));
        });
      });
      db.close();
    });
  }
}
