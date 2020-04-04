import * as path from 'path';
import * as marv from 'marv/api/promise';
import * as driver from 'marv-pg-driver';
import { CONFIG } from '../config';

export async function migrate() {
  const directory = path.resolve('migrations');
  const migrations = await marv.scan(directory);

  const connection = {
    connectionString: CONFIG.DATABASE_URL,
  };
  await marv.migrate(migrations, driver({ connection }));
}
