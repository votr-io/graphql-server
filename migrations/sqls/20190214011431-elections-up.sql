CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY NOT NULL,
    email VARCHAR (256) UNIQUE NOT NULL
);

CREATE TYPE election_status AS ENUM ('PENDING', 'OPEN', 'TALLYING', 'CLOSED');

CREATE TABLE elections (
    id UUID PRIMARY KEY NOT NULL,
    name VARCHAR (200) NOT NULL,
    description VARCHAR (800) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    date_updated TIMESTAMP WITH TIME ZONE,
    candidates jsonb NOT NULL,
    status election_status NOT NULL,
    status_transitions jsonb NOT NULL
);