import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { Context, User } from '../types';
import * as store from '../store';

interface Input {
  id?: string;
  email?: string;
  password?: string;
}
export async function upsertUser(ctx: Context, input: Input) {
  const { id, email, password } = input;

  const encryptedPassword = await encryptPassword(password);

  const user: User = {
    id: id || uuid.v4(),
    dateCreated: new Date(),
    dateUpdated: new Date(),
    email: email || '',
    encryptedPassword: encryptedPassword || '',
  };

  await store.upsertUser(ctx, user);

  return { user };
}

async function encryptPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}
