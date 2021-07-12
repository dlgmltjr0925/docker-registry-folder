import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { AccessTokenPayload } from './dto/access-token-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { SignInInputDto } from './dto/sign-in-input.dto';
import { SignUpInputDto } from './dto/sign-up-input.dto';
import { UserDto } from './dto/user.dto';
import { connect } from '../../lib/sqlite';
import { UpdateProfileDto } from './dto/update-profile.dto';
import dateFormat from 'dateformat';
import { RefreshTokenPayload } from './dto/refresh-token-payload.dto';

@Injectable()
export class AuthService {
  systemAdmin: boolean = false;
  salt = process.env.SALT as string;
  jwtSecret = process.env.JWT_SECRET as string;
  constructor(private jwtService: JwtService) {}

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
    const hashedPassword = await bcrypt.hash(password, await this.salt);
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

  async issueRefreshToken({ id }: UserDto): Promise<string> {
    try {
      const date = new Date();
      const iat = date.valueOf();
      const payload: RefreshTokenPayload = {
        iss: 'docker_registry_folder',
        aud: id,
        iat,
      };
      return this.jwtService.sign(payload, { secret: this.jwtSecret, expiresIn: '30m' });
    } catch (error) {
      console.log('error', error);
      return '';
    }
  }

  async issueAccessToken({ id, username, role, systemAdmin }: UserDto): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: id,
      username,
      role,
      systemAdmin,
    };
    return this.jwtService.sign(payload, { secret: this.jwtSecret });
  }

  async signUp({
    username,
    password,
    role,
    systemAdmin,
  }: SignUpInputDto): Promise<{ user: UserDto; accessToken: string }> {
    const hashedPassword = await bcrypt.hash(password, this.salt);
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
          const user = { id, username, role, systemAdmin };
          const accessToken = await this.issueAccessToken(user);
          resolve({ user, accessToken });
        });
      });
      db.close();
    });
  }

  async update({ id, password }: UpdateProfileDto) {
    return new Promise<boolean>(async (resolve, reject) => {
      const db = connect();
      try {
        const updatedAt = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        const hashedPassword = await bcrypt.hash(password, this.salt);
        const sql = `UPDATE user SET password=?, updated_at=? WHERE id=?`;
        db.run(sql, [hashedPassword, updatedAt, id], (error) => {
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

  getCookieWithJwtToken(token: String) {
    return `DRFR=${token}; HttpOnly; Path=/; Max-Age=${process.env.NODE_ENV === 'production' ? '30m' : '4h'})}`;
  }

  getCookieForSignOut() {
    return `DRFR=; HttpOnly; Path=/; Max-Age=0`;
  }
}
