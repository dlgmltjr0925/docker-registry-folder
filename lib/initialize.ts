import * as bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { verbose } from 'sqlite3';

const ENV_PATH = path.resolve('data/.env');
const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

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
        "token"	TEXT,
        "tag"	TEXT,
        "created_at"	TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        "updated_at"	TEXT NOT NULL DEFAULT (datetime('now','localtime')),
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
        PRIMARY KEY("id" AUTOINCREMENT)
      )`);
    });

    db.close();
  }
};

const genSalt = async () => {
  const salt = await bcrypt.genSalt();
  fs.appendFileSync(ENV_PATH, `SALT=${salt}\n`);
};

const getRandomString = (length: number = 64) => {
  const charLength = CHARS.length;
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * charLength);
    randomString += CHARS.substr(index, 1);
  }
  return randomString;
};

const genJwtSecret = async () => {
  const jwtSecret = getRandomString();
  fs.appendFileSync(ENV_PATH, `JWT_SECRET=${jwtSecret}\n`);
};

const genSessionSecret = async () => {
  const sessionSecret = getRandomString();
  fs.appendFileSync(ENV_PATH, `SESSION_SECRET=${sessionSecret}\n`);
};

const genCryptoPassword = async () => {
  const cryptoPassword = getRandomString(32);
  fs.appendFileSync(ENV_PATH, `CRYPTO_PASSWORD=${cryptoPassword}\n`);
};

const genDotEnvFile = async () => {
  if (!fs.existsSync(ENV_PATH)) {
    fs.writeFileSync(ENV_PATH, '');
  }
  const data = fs.readFileSync(ENV_PATH, { encoding: 'utf-8' });
  if (!/SALT\=/.test(data)) await genSalt();
  if (!/JWT_SECRET\=/.test(data)) await genJwtSecret();
  if (!/SESSION_SECRET\=/.test(data)) await genSessionSecret();
  if (!/CRYPTO_PASSWORD\=/.test(data)) await genCryptoPassword();
};

const initialize = async () => {
  await createTables();
  await genDotEnvFile();
  require('dotenv').config({ path: ENV_PATH });
};

export default initialize;
