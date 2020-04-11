import { sql } from 'slonik';
import { Context, Ballot } from '../types';
import { pool } from '../../postgres';

export async function createBallot(ctx: Context, ballot: Ballot) {
  const { electionId } = ballot;
  const dateCreated = ballot.dateCreated.toISOString();
  const candidateIds = JSON.stringify(ballot.candidateIds);

  const query = sql`
    INSERT INTO ballots (election_id, date_created, candidate_ids)
    VALUES (${electionId}, ${dateCreated}, ${candidateIds});
  `;

  await pool.query(query);
}
