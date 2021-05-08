import path from 'path';
import { OPEN_READWRITE, verbose } from 'sqlite3';

const DB_PATH = path.resolve('data/data.db');

export const connect = () => {
  const sqlite3 = verbose();
  return new sqlite3.Database(DB_PATH, OPEN_READWRITE);
};
