import { Injectable } from '@nestjs/common';

import { connect } from '../../utils/sqlite';

@Injectable()
export class AuthService {
  systemAdmin: boolean = false;

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
    });
  }
}
