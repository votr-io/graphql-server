import { sql } from 'slonik';
import { Election, Context } from '../types';
import { pool } from '../../postgres';

export async function upsertElection(ctx: Context, election: Election) {
  const { id, createdBy, name, description, status } = election;
  const dateCreated = election.dateCreated.toISOString();
  const dateUpdated = election.dateUpdated.toISOString();
  const candidates = JSON.stringify(election.candidates);
  const results = election.results ? JSON.stringify(election.results) : null;

  const query = sql`
    INSERT INTO elections (id, date_created, date_updated, created_by, name, description, candidates, status, results)
    VALUES (${id}, ${dateCreated}, ${dateUpdated}, ${createdBy}, ${name}, ${description}, ${candidates}, ${status}, ${results})
    ON CONFLICT (id)
    DO UPDATE SET   date_created  = ${dateCreated},
                    date_updated  = ${dateUpdated},
                    created_by    = ${createdBy},
                    name          = ${name},
                    description   = ${description},
                    candidates    = ${candidates},
                    status        = ${status},
                    results       = ${results};
    
    `;

  await pool.query(query);
}
