CREATE TABLE IF NOT EXISTS elections (
  id TEXT PRIMARY KEY NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() at time zone 'utc'),
  date_updated TIMESTAMP WITH TIME ZONE DEFAULT (now() at time zone 'utc'),
  created_by TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  candidates JSON NOT NULL,
  results JSON
);
CREATE TABLE IF NOT EXISTS ballots (
  election_id TEXT NOT NULL REFERENCES elections (id),
  date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() at time zone 'utc'),
  votes JSON NOT NULL
);