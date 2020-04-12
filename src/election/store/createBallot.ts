import { sql } from 'slonik';
import { Context, Ballot } from '../types';
import { pool } from '../../postgres';

export async function createBallot(ctx: Context, ballot: Ballot) {
  const { electionId } = ballot;
  const dateCreated = ballot.dateCreated.toISOString();
  const candidateIds = JSON.stringify(ballot.candidateIds);

  /**
   *      perform_deletes as (
         delete from ${tableName}
             ${postgresWhere}
             returning 1
     ),
     perform_inserts as (
         insert into ${tableName}
             select * from updated_data
             returning 1
     )
select '${tableName}'                      table_name,
       (select count(*) from perform_deletes) rows_deleted,
       (select count(*) from perform_inserts) rows_inserted;
   */

  const query = sql`
  WITH insert_ballot AS (
    INSERT INTO ballots (election_id, date_created, candidate_ids)
    VALUES (${electionId}, ${dateCreated}, ${candidateIds})
    returning 1
  ), update_election AS (
      UPDATE elections 
      SET vote_count = vote_count + 1
      WHERE id = ${electionId}
      returning 1
  )
  select
  (select count(*) from insert_ballot) ballots_inserted,
  (select count(*) from update_election) elections_updated;
  `;

  await pool.query(query);
}
