import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_PROJECT_URL)
  throw new Error("SUPABSE_PRJOECT_URL env variable doesn't exist.");

if (!process.env.SUPABASE_SECRET_KEY)
  throw new Error("SUPABSE_SECRET_KEY env variable doesn't exist.");

export const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_SECRET_KEY,
);
