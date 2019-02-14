import { db } from './db';

export interface User {
  id: string;
  email: string;
}

export const createUser = async (input: { user: User }) => {
  const { id, email } = input.user;
  await db.none('INSERT INTO users VALUES($(id), $(email));', { id, email });
};

export const getUsers = async (input: { ids: String[] }): Promise<User[]> => {
  const { ids } = input;
  return await db.any('SELECT * FROM users WHERE id IN ($1:csv);', ids);
};

export const deleteUsers = async (input: { ids: String[] }) => {
  const { ids } = input;
  await db.none('delete FROM users WHERE id IN ($1:csv);', ids);
};
