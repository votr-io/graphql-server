import { Pool, PoolClient } from 'pg';

//TODO: get the from env vars
export const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'passw0rd',
  database: 'postgres',
  port: 5432,
});

export async function withPool<T>(call: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect();
  try {
    return await call(client);
  } catch (e) {
    console.log(e.stack);
    throw e;
  } finally {
    client.release();
  }
}
