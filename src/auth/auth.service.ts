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
      db.all(sql, (err, rows) => {
        if (err) return reject(err);
        this.systemAdmin = rows.length === 1;
        resolve(this.systemAdmin);
      });
    });
  }
}
