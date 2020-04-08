import * as bcrypt from 'bcrypt';
import { Context, User } from '../types';
import * as store from '../store';
import * as tokens from '../../tokens';

interface Input {
  email: string;
  password: string;
}

interface Output {
  user: User;
  token: string;
}

export async function login(ctx: Context, input: Input): Promise<Output> {
  const { email, password } = input;

  const user = await store.getUserByEmail(ctx, email);

  if (!user) {
    throw new Error('cound not find user: incorrect email or password');
  }

  const passwordIsCorrect = await isMatch(password, user.encryptedPassword);

  if (!passwordIsCorrect) {
    throw new Error('incorrect email or password');
  }

  const token = tokens.createUserAccessToken(user);

  return { user, token };
}

async function isMatch(password: string, encryptedPassword: string) {
  return bcrypt.compare(password, encryptedPassword);
}
