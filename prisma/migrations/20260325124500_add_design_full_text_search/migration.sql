-- Full-text search support for design name and description
ALTER TABLE "public"."Design"
ADD COLUMN IF NOT EXISTS "search_vector" tsvector
GENERATED ALWAYS AS (
  to_tsvector('english', coalesce("name", '') || ' ' || coalesce("description", ''))
) STORED;

CREATE INDEX IF NOT EXISTS "Design_search_vector_idx"
ON "public"."Design" USING gin("search_vector");
