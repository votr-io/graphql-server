import { db } from '../db/db';
import { User } from './api';

export const createUser = async (user: User) => {
  const { id, email } = user;
  await db.none('INSERT INTO users VALUES($(id), $(email));', { id, email });
};

export const getUsers = async (ids: String[]): Promise<User[]> => {
  return await db.any('SELECT * FROM users WHERE id IN ($1:csv);', ids);
};

export const deleteUsers = async (ids: String[]) => {
  await db.none('delete FROM users WHERE id IN ($1:csv);', ids);
};
