import { User } from '../types';
import { Context } from '../../context';
import { CONFIG } from '../../config';
import { sql } from 'slonik';
import { pool, Sql } from '../../postgres';

export interface Input {
  where?: UserFilters;
  limit?: number;
  // cursor?: string;
}

export interface UserFilters {
  ids?: string[];
  emails?: string[];
}

export interface Output {
  users: User[];
  // pageInfo: PageInfo;
}

export async function listUsers(ctx: Context, input: Input): Promise<Output> {
  const where = buildWhereClause(input);
  const limit = buildLimitClause(input);

  const query = sql`
  SELECT * 
  FROM users
  ${where}
  ORDER BY id ASC
  ${limit};
  `;

  const rows = await pool.any<Row>(query);

  const users = rows.map(parseRow);
  return {
    users,
  };
}

interface Row {
  id: string;
  date_created: Date;
  date_updated: Date;
  email: string;
  encrypted_password: string;
}

function parseRow(row: Row): User {
  return {
    id: row.id,
    dateCreated: row.date_created,
    dateUpdated: row.date_updated,
    email: row.email,
    encryptedPassword: row.encrypted_password,
  };
}

function buildWhereClause(input: Input): Sql {
  // const cursor = input.cursor && decode(input.cursor);

  const filters = input.where || {};

  const whereParts: Sql[] = [];

  // if (cursor) {
  //   whereParts.push(sql`id > ${cursor.id}`);
  // }

  if (filters.ids) {
    whereParts.push(sql`id = ANY(${sql.array(filters.ids, 'text')})`);
  }

  if (filters.emails) {
    whereParts.push(sql`email = ANY(${sql.array(filters.emails, 'text')})`);
  }

  return whereParts.length > 0 ? sql`WHERE ${sql.join(whereParts, sql` AND `)}` : sql``;
}

function buildLimitClause(input: Input): Sql {
  return sql`LIMIT ${input.limit || CONFIG.DEFAULT_LIMIT}`;
}
