import { User } from '../types';
import { Context } from '../../context';
import { listUsers } from './listUsers';

export interface Input {
  id: string;
}

export interface Output {
  user: User | null;
}

export async function getUser(ctx: Context, input: Input): Promise<Output> {
  const { id } = input;
  if (!id) {
    return { user: null };
  }

  const { users } = await listUsers(ctx, {
    where: {
      ids: [id],
    },
  });

  return {
    user: users[0] ? users[0] : null,
  };
}
