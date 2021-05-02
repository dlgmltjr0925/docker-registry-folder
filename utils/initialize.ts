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
        "created_at"	TEXT NOT NULL,
        "updated_at"	TEXT NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
      );`);

      db.run(`CREATE TABLE "registry" (
        "id"	INTEGER NOT NULL,
        "name"	TEXT NOT NULL,
        "host"	TEXT NOT NULL,
        "auth"	TEXT,
        "tag"	TEXT,
        "created_at"	TEXT NOT NULL,
        "updated_at"	TEXT NOT NULL,
        "deleted_at"	TEXT DEFAULT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
      );`);

      db.run(`CREATE TABLE "repository" (
        "id"	INTEGER NOT NULL,
        "registry_id"	INTEGER NOT NULL,
        "name"	TEXT NOT NULL,
        "git_repository_url"	TEXT DEFAULT NULL,
        "description"	TEXT,
        "created_at"	TEXT NOT NULL,
        "updated_at"	TEXT NOT NULL,
        "deleted_at"	TEXT DEFAULT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
      )`);
    });

    db.close();
  }
};

const initialize = async () => {
  await createTables();
};

export default initialize;
