import { db } from './db';
import { isObject } from 'util';
import { UserInputError } from 'apollo-server';
import { Observable } from 'rxjs';
import * as QueryStream from 'pg-query-stream';
import { Election } from '../domain/types';

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
  const { election } = input;
  const query = `UPDATE elections SET name = $(name), description = $(description), date_updated = $(date_updated), status = $(status), results = $(results), candidates = $(candidates) WHERE id = $(id)`;
  await db.none(query, {
    ...election,
    candidates: JSON.stringify(election.candidates),
    results: JSON.stringify(election.results),
  });
  return input.election;
};

export const getElections = async (input: { ids: String[] }): Promise<Election[]> => {
  const { ids } = input;
  return await db.any('SELECT * FROM elections WHERE id IN ($1:csv);', ids);
};

export const deleteElections = async (input: { ids: String[] }) => {
  const { ids } = input;
  //TODO: make this transactional
  await db.none('DELETE FROM ballots WHERE election_id IN ($1:csv);', ids);
  return await db.none('DELETE FROM elections WHERE id IN ($1:csv);', ids);
};

export const getElection = async (id: string): Promise<Election> => {
  const [election] = await getElections({ ids: [id] });
  return election;
};

//TOOD: refactor this to take candidate ids - the index thing is a concern of the DBB
export const createBallot = async (input: {
  electionId: string;
  candidateIndexes: number[];
}) => {
  const { electionId, candidateIndexes } = input;
  await db.none(`INSERT INTO ballots VALUES($1, $2)`, [
    electionId,
    JSON.stringify(candidateIndexes),
  ]);
};

export const observeBallots = (electionId: string): Observable<string[]> => {
  return new Observable(o => {
    //start by getting the election so we can do the tranlation of candidate index to candidate id
    getElection(electionId)
      .then(({ candidates }) => {
        //now that we have the election, set up our stream of ballots out of the db
        //this library should handle back pressure and keep our memory use low
        const qs = new QueryStream(`SELECT * FROM ballots where election_id = $1`, [
          electionId,
        ]);

        //stream rows out of the db, transform the index based ballot to candidate ids, and next the value onto the observable
        db.stream(qs, stream => {
          stream.on('error', o.error);
          stream.on('data', ({ ballot }) => {
            const indexBallot: number[] = JSON.parse(ballot);
            o.next(indexBallot.map(candidateIndex => candidates[candidateIndex].id));
          });
          stream.on('end', () => o.complete());
        });
      })
      .catch(o.error);
  });
};

export const withNotFound = async <T>(t: T): Promise<T> => {
  if (!t) throw new UserInputError('404'); //TODO: figure out how to type errors
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
