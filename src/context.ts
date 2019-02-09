import { db, Db } from './db';

export interface Context {
  token: string;
  db: Db;
}
export function context({ req }): Context {
  const token = req.headers['x-token'] || '';
  return { token, db };
}
