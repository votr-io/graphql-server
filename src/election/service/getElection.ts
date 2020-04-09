import { Context } from '../../context';
import { Election } from '../types';
import * as store from '../store';

interface Input {
  id: string;
}

interface Output {
  election?: Election;
}

export async function getElection(ctx: Context, input: Input): Promise<Output> {
  const { id } = input;

  const election = await store.getElection(ctx, id);
  return { election };
}
