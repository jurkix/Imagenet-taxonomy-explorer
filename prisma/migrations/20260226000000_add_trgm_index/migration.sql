-- Enable trigram extension for fast ILIKE substring search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Replace B-tree index with GIN trigram index on name column
DROP INDEX IF EXISTS "idx_name";
CREATE INDEX "idx_name_trgm" ON "synsets" USING gin ("name" gin_trgm_ops);
