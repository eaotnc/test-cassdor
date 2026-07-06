-- Reference schema (applied automatically by the API on startup).
-- You can also run this manually: cqlsh -f cassandra/init.cql

CREATE KEYSPACE IF NOT EXISTS acme
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE acme;

CREATE TABLE IF NOT EXISTS auth_users (
  username text PRIMARY KEY,
  password_hash text,
  name text,
  email text,
  roles set<text>
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  token_id text PRIMARY KEY,
  username text,
  expires_at timestamp
);

CREATE TABLE IF NOT EXISTS app_users (
  id text PRIMARY KEY,
  name text,
  email text,
  role text,
  status text,
  last_active text
);

CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  customer text,
  amount double,
  status text,
  date text
);

CREATE TABLE IF NOT EXISTS dashboard_stats (
  id text PRIMARY KEY,
  title text,
  value double,
  prefix text,
  suffix text,
  delta double,
  sort_order int
);

CREATE TABLE IF NOT EXISTS revenue_points (
  id text PRIMARY KEY,
  month text,
  value int,
  sort_order int
);
