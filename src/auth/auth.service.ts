import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { SignInInputDto } from './dto/sign-in-input.dto';
import { SignUpInputDto } from './dto/sign-up-input.dto';
import { UserDto } from './dto/user.dto';
import { connect } from '../../utils/sqlite';
import fs from 'fs';
import path from 'path';

@Injectable()
export class AuthService {
  systemAdmin: boolean = false;
  salt: string | null = null;
  constructor(private jwtService: JwtService) {}

  async getSalt(): Promise<string> {
    if (this.salt === null) {
      const saltPath = path.resolve('data/salt');
      this.salt = fs.readFileSync(saltPath, 'binary');
    }
    return this.salt;
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
    try {
      const hashedPassword = await bcrypt.hash(password, await this.getSalt());
      return new Promise((resolve, reject) => {
        const sql = `SELECT id, username, role, system_admin FROM user WHERE username=? AND password=?`;
        const db = connect();
        db.each(sql, [username, hashedPassword], (error, row) => {
          if (error) return reject(error);
          if (row === null) resolve(null);
          else {
            const { id, username, role, system_admin: systemAdmin } = row;
            resolve({
              id,
              username,
              role,
              systemAdmin,
            });
          }
          console.log(row);
        });
        db.close();
      });
    } catch (error) {
      throw error;
    }
  }

  async issueAccessToken({ id, username, role, systemAdmin }: UserDto): Promise<string> {
    const payload = {
      sub: id,
      username,
      role,
      systemAdmin,
    };
    return this.jwtService.sign(payload);
  }

  async signUp({ username, password, role, systemAdmin }: SignUpInputDto): Promise<string> {
    try {
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
          db.each(sql, [username, hashedPassword], (error, row) => {
            if (error) return reject(error);
            const { id, username, role, system_admin: systemAdmin } = row;
            const payload = {
              sub: id,
              username,
              role,
              systemAdmin,
            };
            resolve(this.jwtService.sign(payload));
          });
        });
        db.close();
      });
    } catch (error) {
      throw error;
    }
  }
}
