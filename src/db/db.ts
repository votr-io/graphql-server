import { IMain, IDatabase } from 'pg-promise';
import * as pgPromise from 'pg-promise';

const pgp: IMain = pgPromise({
  // Initialization Options
});

const cn: string = 'postgres://postgres:passw0rd@localhost:5432/postgres';

export const db: IDatabase<any> = pgp(cn);
