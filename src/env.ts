export const ENV = {
  PORT: process.env.PORT || '5000',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'asfd',
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgres://postgres:passw0rd@localhost:5432/postgres',
};
