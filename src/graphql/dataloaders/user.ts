import * as DataLoader from 'dataloader';
import * as service from '../../user/service';
import { Context } from '../../context';
import { User } from '../../user/service/types';
import { keyById } from '../../util';

export function newUserDataLoader(ctx: Context) {
  return new DataLoader<string, User>(async (ids: string[]) => {
    const { users } = await service.listUsers(ctx, {
      where: {
        ids,
      },
    });
    const byId = keyById(users);
    return ids.map((id) => byId[id] || null);
  });
}
