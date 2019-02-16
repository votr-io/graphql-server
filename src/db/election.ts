import { withPool } from './pool';
import { db } from './db';
import { isObject } from 'util';

export interface Election {
  id: string;
  name: string;
  description: string;
  created_by: string;
  date_created: string;
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

export const createElection = async (input: {
  election: Election;
}): Promise<Election> => {
  const [columns, values] = columnsAndValues(input.election);
  const query = `INSERT INTO elections VALUES(${columns.join(', ')});`;
  await db.none(query, values);
  return input.election;
};

export const getElections = async (input: { ids: String[] }): Promise<Election[]> => {
  const { ids } = input;
  return await db.any('SELECT * FROM elections WHERE id IN ($1:csv);', ids);
};

export const deleteElections = async (input: { ids: String[] }) => {
  const { ids } = input;
  return await db.any('DELETE FROM elections WHERE id IN ($1:csv);', ids);
};

function columnsAndValues(o: Object): [string[], Object] {
  const keys = Object.keys(o);
  const values = keys.reduce((acc, key) => {
    const value = o[key];
    acc[key] = isObject(value) ? JSON.stringify(value) : value;
    return acc;
  }, {});
  return [keys.map(key => `$(${key})`), values];
}
