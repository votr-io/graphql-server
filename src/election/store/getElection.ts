import { Election } from '../types';
import { Context } from '../../context';
import { listElections } from './listElections';

export async function getElection(ctx: Context, id: string): Promise<Election | null> {
  const { elections } = await listElections(ctx, {
    where: {
      ids: [id],
    },
  });

  return elections[0] ? elections[0] : null;
}
