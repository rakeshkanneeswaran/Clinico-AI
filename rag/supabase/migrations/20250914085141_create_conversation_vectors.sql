create table if not exists conversation_vectors (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  content text not null,
  embedding vector(768) not null,
  created_at timestamptz default now()
);