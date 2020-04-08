import * as uuid from 'uuid';
import * as isValidUuid from 'uuid-validate';
import * as bcrypt from 'bcrypt';
import { Context, User } from '../types';
import * as store from '../store';
import * as tokens from '../../tokens';

interface Input {
  id?: string;
  email?: string;
  password?: string;
}

interface Output {
  user: User;
  token: string;
}

export async function upsertUser(ctx: Context, input: Input): Promise<Output> {
  const { id, email } = input;

  if (id && !isValidUuid(id)) {
    throw new Error(`${id} is not a valid uuid`);
  }

  if (email && !isValidEmailAddress(email)) {
    throw new Error(`${email} is not a valid email address`);
  }

  const existingUser = id ? await store.getUserById(ctx, id) : null;

  const user = existingUser
    ? await updateUser(ctx, input, existingUser)
    : await createUser(ctx, input);

  await store.upsertUser(ctx, user);

  const token = tokens.createUserAccessToken(user);

  return { user, token };
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
  const claims = tokens.validateUserAccessToken(ctx.token);

  if (claims.id !== existingUser.id) {
    throw new Error('not authorized');
  }

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

function isValidEmailAddress(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
