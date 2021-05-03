import * as bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { verbose } from 'sqlite3';

export const createTables = async () => {
  const dbPath = path.resolve('data/data.db');
  if (!fs.existsSync(dbPath)) {
    const sqlite3 = verbose();
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
      db.run(`CREATE TABLE "user" (
        "id"	INTEGER NOT NULL,
        "username"	TEXT NOT NULL UNIQUE,
        "password"	TEXT NOT NULL,
        "role"	TEXT NOT NULL,
        "system_admin"	INTEGER NOT NULL DEFAULT 0,
        "created_at"	TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        "updated_at"	TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        PRIMARY KEY("id" AUTOINCREMENT)
      );`);

      db.run(`CREATE TABLE "registry" (
        "id"	INTEGER NOT NULL,
        "name"	TEXT NOT NULL,
        "host"	TEXT NOT NULL,
        "auth"	TEXT,
        "tag"	TEXT,
        "created_at"	TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        "updated_at"	TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        "deleted_at"	TEXT DEFAULT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
      );`);

      db.run(`CREATE TABLE "repository" (
        "id"	INTEGER NOT NULL,
        "registry_id"	INTEGER NOT NULL,
        "name"	TEXT NOT NULL,
        "git_repository_url"	TEXT DEFAULT NULL,
        "description"	TEXT,
        "created_at"	TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        "updated_at"	TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        "deleted_at"	TEXT DEFAULT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
      )`);
    });

    db.close();
  }
};

const genSalt = async () => {
  const saltPath = path.resolve('data/salt');
  if (!fs.existsSync(saltPath)) {
    const salt = await bcrypt.genSalt();
    fs.writeFileSync(saltPath, salt, 'binary');
  }
};

const initialize = async () => {
  await createTables();
  await genSalt();
};

export default initialize;
