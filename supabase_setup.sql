-- 1. pgvector 확장 활성화
create extension if not exists vector;

-- 2. 문서 조각(Chunk)을 저장할 테이블 생성
create table if not exists documents (
  id bigserial primary key,
  content text, -- 실제 텍스트 내용
  metadata jsonb, -- 파일명, 페이지 번호 등
  embedding vector(768) -- Gemini 임베딩 벡터 (768차원)
);

-- 3. 벡터 유사도 검색을 위한 함수 생성
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;
