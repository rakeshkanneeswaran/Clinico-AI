-- Enable the pgvector extension to work with embeddings
create extension if not exists vector with schema public;

-- Create a table to store conversation vectors
create table public.conversation_vectors (
  id bigserial primary key,
  session_id text not null,
  content text not null,
  embedding vector(768), -- Adjust the dimension based on your embedding model
  created_at timestamp with time zone default now()
);

-- Create an index for efficient similarity search
create index on public.conversation_vectors using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Create an index on session_id for filtering
create index idx_conversation_vectors_session_id on public.conversation_vectors (session_id);

-- Create a function to search for similar conversations
create or replace function public.match_conversations(
  query_embedding vector(768),
  match_count int default 1,
  filter_session_id text default null
) returns table (
  id bigint,
  session_id text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    cv.id,
    cv.session_id,
    cv.content,
    1 - (cv.embedding <=> query_embedding) as similarity
  from public.conversation_vectors cv
  where (filter_session_id is null or cv.session_id = filter_session_id)
  order by cv.embedding <=> query_embedding
  limit match_count;
$$;