CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX user_username_tgram_idx ON "User" USING GIN (username gin_trgm_ops);
CREATE INDEX post_title_tgram_idx ON "Post" USING GIN (title gin_trgm_ops);