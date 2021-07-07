import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from '../auth/dto/user.dto';
import { connect } from '../../lib/sqlite';

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
