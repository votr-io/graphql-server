import { Context, User } from '../types';
import * as store from '../store';
import * as tokens from '../../tokens';

interface Input {
  where?: UserFilters;
}
interface UserFilters {
  ids?: string[];
}

interface Output {
  users: User[];
}

export async function listUsers(ctx: Context, input: Input): Promise<Output> {
  const { token } = ctx;

  const id = token ? tokens.validateUserAccessToken(token).id : null;

  const { users } = await store.listUsers(ctx, input);

  return {
    users: users.map((user) => ({
      ...user,
      email: user.id === id ? user.email : '',
    })),
  };
}
