import { User } from './types';
import { Context } from '../../context';
import { listUsers } from './listUsers';

export async function getUserById(ctx: Context, id: string): Promise<User | null> {
  const { users } = await listUsers(ctx, {
    where: {
      ids: [id],
    },
  });

  return users[0] ? users[0] : null;
}

export async function getUserByEmail(ctx: Context, email: string): Promise<User | null> {
  const { users } = await listUsers(ctx, {
    where: {
      emails: [email],
    },
  });

  return users[0] ? users[0] : null;
}
