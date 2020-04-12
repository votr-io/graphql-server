import { Election, PageInfo } from '../types';
import { Context } from '../../context';
import { last, first } from 'lodash';
import { encode, decode } from './cursor';
import { CONFIG } from '../../config';
import { sql } from 'slonik';
import { pool, Sql } from '../../postgres';

export interface Input {
  where?: ElectionFilters;
  limit?: number;
  cursor?: string;
}

export interface ElectionFilters {
  ids?: string[];
}

export interface Output {
  elections: Election[];
}

export async function listElections(ctx: Context, input: Input): Promise<Output> {
  const where = buildWhereClause(input);
  const limit = buildLimitClause(input);

  const query = sql`
  SELECT * 
  FROM elections
  ${where}
  ORDER BY id ASC
  ${limit};
  `;

  const rows = await pool.any<Row>(query);

  const elections = rows.map(parseRow);
  return {
    elections,
  };
}

interface Row {
  id: string;
  date_created: Date;
  date_updated: Date;
  created_by?: string;
  name: string;
  description: string;
  status: string;
  vote_count: number;
  candidates: any;
  results?: any;
}

function parseRow(row: Row): Election {
  return {
    id: row.id,
    dateCreated: row.date_created,
    dateUpdated: row.date_updated,
    createdBy: row.created_by,
    name: row.name,
    description: row.description,
    status: row.status as Election['status'],
    voteCount: row.vote_count,
    candidates: row.candidates,
    results: row.results,
  };
}

function buildWhereClause(input: Input): Sql {
  const cursor = input.cursor && decode(input.cursor);

  const filters = input.where || {};

  const whereParts: Sql[] = [];

  if (cursor) {
    whereParts.push(sql`id > ${cursor.id}`);
  }

  if (filters.ids) {
    whereParts.push(sql`id = ANY(${sql.array(filters.ids, 'text')})`);
  }

  return whereParts.length > 0 ? sql`WHERE ${sql.join(whereParts, sql` AND `)}` : sql``;
}

function buildLimitClause(input: Input): Sql {
  return sql`LIMIT ${input.limit || CONFIG.DEFAULT_LIMIT}`;
}
