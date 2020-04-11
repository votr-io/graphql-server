import { Transform, Readable } from 'stream';
import { sql } from 'slonik';
import { Context, Ballot } from '../types';
import { pool } from '../../postgres';

interface Row {
  election_id: string;
  date_created: Date;
  candidate_ids: any;
}

export function getBallotStream(ctx: Context, electionId: string): Readable {
  const ret = new Transform({
    objectMode: true,
    transform: (data, _, cb) => cb(null, parseRow(data.row)),
  });

  const query = sql`SELECT * FROM ballots where election_id = ${electionId};`;
  pool.stream(query, (stream) => {
    stream.pipe(ret);
  });

  return ret;
}

function parseRow(row: Row): Ballot {
  return {
    electionId: row.election_id,
    dateCreated: row.date_created,
    candidateIds: row.candidate_ids,
  };
}
