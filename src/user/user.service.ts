import { Injectable } from '@nestjs/common';
import { connect } from 'lib/sqlite';
import { UserDto } from 'src/auth/dto/user.dto';
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
        const sql = `SELECT id, username, role, system_admin FROM user`;
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
