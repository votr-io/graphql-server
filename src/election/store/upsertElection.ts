import { Election, PageInfo, Status } from '../types';
import { Context } from '../../context';
import { last, first } from 'lodash';
import { encode, decode } from './cursor';
import { CONFIG } from '../../config';
import { sql } from 'slonik';
import { pool, Sql } from '../../postgres';

export interface Input {
  election: Election;
}

export interface Output {}

export async function listElections(ctx: Context, input: Input): Promise<Output> {
  const query = sql`
  SELECT * 
  FROM elections;
  `;

  await pool.any(query);

  return {};
}
