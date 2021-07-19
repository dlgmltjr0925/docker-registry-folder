import * as bcrypt from 'bcrypt';

import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { Role } from '../auth/interfaces/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from '../auth/dto/user.dto';
import { connect } from '../../lib/sqlite';
import dateFormat from 'dateformat';

@Injectable()
export class UserService {
  constructor(private authService: AuthService) {}

  create(createUserDto: CreateUserDto) {
    return new Promise<UserDto>(async (resolve, reject) => {
      const db = connect();
      try {
        const { user } = await this.authService.signUp({ ...createUserDto, systemAdmin: false });
        resolve(user);
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  update(updateUserDto: UpdateUserDto) {
    return new Promise<boolean>(async (resolve, reject) => {
      const db = connect();
      try {
        const { id, password, systemAdmin } = updateUserDto;
        const role = systemAdmin ? Role.ADMIN : updateUserDto.role;

        const updatedAt = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');

        if (password) {
          const hashedPassword = await bcrypt.hash(password, this.authService.salt);
          const sql = `UPDATE user SET password=?, role=?, updated_at=? WHERE id=?`;
          db.run(sql, [hashedPassword, role, updatedAt, id], (error) => {
            if (error) throw error;
            resolve(true);
          });
        } else {
          const sql = `UPDATE user SET role=?, updated_at=? WHERE id=?`;
          db.run(sql, [role, updatedAt, id], (error) => {
            if (error) throw error;
            resolve(true);
          });
        }
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  findAll() {
    return new Promise<UserDto[]>((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, username, role, system_admin as systemAdmin FROM user`;
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
    return new Promise<UserDto[]>((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, username, role, system_admin as systemAdmin FROM user WHERE username LIKE ? OR role LIKE ?`;
        const likeKeyword = `%${keyword}%`;
        db.all(sql, [likeKeyword, likeKeyword], (error, rows) => {
          if (error) throw error;
          resolve(rows.map((row) => ({ ...row, systemAdmin: row.systemAdmin === 1 })));
        });
      } catch (error) {
        reject(error);
      } finally {
        db.close();
      }
    });
  }

  findOneById(id: number) {
    return new Promise<UserDto>((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, username, role, system_admin as systemAdmin FROM user WHERE id=?`;
        db.each(sql, [id], (error, row) => {
          if (error) return reject(error);
          resolve({ ...row, systemAdmin: row.systemAdmin === 1 });
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
        const sql = `DELETE FROM user WHERE id IN (${ids})`;
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
}
