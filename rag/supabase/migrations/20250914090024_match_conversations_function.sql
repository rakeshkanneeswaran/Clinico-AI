-- Drop the old function first (if it exists)
drop function if exists match_conversations(vector(768), int, text);

-- Create the new function with session_id as text
create function match_conversations(
  query_embedding vector(768),
  match_count int,
  filter_session_id text default null
)
returns table(id uuid, content text, session_id text, similarity float)
language sql stable as $$
  select
    cv.id,
    cv.content,
    cv.session_id,
    1 - (cv.embedding <-> query_embedding) as similarity
  from conversation_vectors cv
  where filter_session_id is null or cv.session_id = filter_session_id
  order by cv.embedding <-> query_embedding
  limit match_count;
$$;
