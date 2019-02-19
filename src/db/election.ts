import { CreateCandidateInput } from './../tests/generated/globalTypes';
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

export const updateElection = async (input: {
  election: Election;
}): Promise<Election> => {
  const query = `UPDATE elections SET name = $(name), description = $(description), date_updated = $(date_updated), status = $(status) WHERE id = $(id)`;
  await db.none(query, input.election);
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

const createCandidatesSQL = `
UPDATE elections
SET date_updated = now() at time zone 'utc',
candidates = candidates || $2::JSONB
WHERE id = $1;
`;

export const createCandidates = async (input: {
  electionId: string;
  candidates: CreateCandidateInput[];
}): Promise<Election> => {
  const { electionId, candidates } = input;
  await db.none(createCandidatesSQL, [electionId, JSON.stringify(candidates)]);
  return getElection(electionId);
};

const deleteCandidateSQL = `
UPDATE elections
SET candidates = (SELECT jsonb_agg(e.value) --after all the stuff below this, we need to turn the value back into an array, since that's what we're setting
                  FROM (
                         SELECT candidates
                         FROM elections
                         WHERE id = $1
                       ) election, jsonb_array_elements(
                                       election.candidates) e -- e will be a table with one column called "value".  each candidate will be a row
                  WHERE e.value ->> 'id' NOT IN ($2:csv) -- filter out the one we want to delete, targeting the id property
)
WHERE id = $1;
`;

export const deleteCandidates = async (input: {
  electionId: string;
  candidateIds: string[];
}): Promise<Election> => {
  const { electionId, candidateIds } = input;
  await db.any(deleteCandidateSQL, [electionId, candidateIds]);
  return getElection(electionId);
};

export const getElection = async (id: string): Promise<Election> => {
  const [election] = await getElections({ ids: [id] });
  return election;
};

export const withNotFound = async <T>(t: T): Promise<T> => {
  if (!t) throw new Error('404'); //TODO: figure out how to type errors
  return t;
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
