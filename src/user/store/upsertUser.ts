import { sql } from 'slonik';
import { User, Context } from '../types';
import { pool } from '../../postgres';

export async function upsertUser(ctx: Context, user: User) {
  const { id, dateCreated, dateUpdated, email, encryptedPassword } = user;

  const query = sql`
    INSERT INTO users (id, date_created, date_updated, email, encrypted_password)
    VALUES (${id}, ${dateCreated.toISOString()}, ${dateUpdated.toISOString()}, ${email}, ${encryptedPassword})
    ON CONFLICT (id)
    DO UPDATE SET   date_created = ${dateCreated.toISOString()},
                    date_updated = ${dateUpdated.toISOString()},
                    email = ${email},
                    encrypted_password = ${encryptedPassword};
    
    `;

  await pool.query(query);
}
