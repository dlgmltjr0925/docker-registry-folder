import { UserDto } from 'src/auth/dto/user.dto';

import { Injectable } from '@nestjs/common';

import { connect } from '../../lib/sqlite';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
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
    return new Promise<UserDto>((resolve, reject) => {
      const db = connect();
      try {
        const sql = `SELECT id, username, role, system_admin as systemAdmin FROM user WHERE id=?`;
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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
