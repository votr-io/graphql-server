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
  const { id } = input;

  const { user: existingUser } = await store.getUser(ctx, { id });

  const user = existingUser
    ? await updateUser(ctx, input, existingUser)
    : await createUser(ctx, input);

  await store.upsertUser(ctx, user);

  return { user };
}

async function createUser(ctx: Context, input: Input) {
  const { id, email, password } = input;

  if (!email || !password) {
    throw new Error('email and password are required when creating new users');
  }

  const encryptedPassword = await encryptPassword(password);

  const now = new Date();
  const user: User = {
    id: id || uuid.v4(),
    dateCreated: now,
    dateUpdated: now,
    email,
    encryptedPassword,
  };

  return user;
}

async function updateUser(ctx: Context, input: Input, existingUser: User) {
  const { email, password } = input;

  let encryptedPassword =
    (await encryptPassword(password)) || existingUser.encryptedPassword;

  const user: User = {
    ...existingUser,
    dateUpdated: new Date(),
    email: email || existingUser.email,
    encryptedPassword,
  };

  return user;
}

async function encryptPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}
