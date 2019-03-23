import { Context } from '../../context';

import * as db from '../../db/election';
import { Election } from '../types';

export async function getElections(ctx: Context, ids: string[]): Promise<Election[]> {
  return db.getElections({ ids });
}
