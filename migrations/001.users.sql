CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() at time zone 'utc'),
  date_updated TIMESTAMP WITH TIME ZONE DEFAULT (now() at time zone 'utc'),
  email TEXT,
  encrypted_password TEXT
);
CREATE UNIQUE INDEX ON users (email);