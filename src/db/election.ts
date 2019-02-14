import { withPool } from './pool';
import { db } from './db';
import { isObject } from 'util';

export interface Election {
  id: string;
  name: string;
  description: string;
  created_by: string;
  date_updated: string;
  candidates: {
    id: string;
    name: string;
    description: string;
  }[];
  status: ElectionStatus;
  status_transitions: { on: string; status: ElectionStatus }[];
  results?: {
    winner: string;
    replay: {
      candidate_totals: CandidateVotes[];
      redistribution: CandidateVotes[];
    }[];
  };
}

export type ElectionStatus = 'PENDING' | 'OPEN' | 'TALLYING' | 'CLOSED';

export interface CandidateVotes {
  candidate_id: string;
  votes: number;
}

export const createElection = async (input: { election: Election }) => {
  const [columns, values] = columnsAndValues(input.election);
  return await db.none(`INSERT INTO elections VALUES(${columns.join(', ')});`, values);
};

export const getElections = async (input: { ids: String[] }): Promise<Election[]> => {
  const { ids } = input;
  return await db.any('SELECT * FROM elections WHERE id IN ($1:csv);', ids);
};

function columnsAndValues(o: Object): [string[], any[]] {
  const keys = Object.keys(o);
  const values = keys.map(key => {
    if (isObject(o[key])) return JSON.stringify(o[key]);
    return o[key];
  });
  return [keys.map(key => `$(${key})`), values];
}

function toSqlIndexArgs(list: any[]): string {
  return list.map((_, i) => `$${i + 1}`).join(',');
}
