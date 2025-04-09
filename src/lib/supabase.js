import { createClient } from "@supabase/supabase-js"

// Asegúrate de que estas variables estén definidas en tu archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://rfuvekvictlomgrxlhzf.supabase.co"
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmdXZla3ZpY3Rsb21ncnhsaHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjM4MjIsImV4cCI6MjA1OTY5OTgyMn0.-YVr_UYRj0O_dCwqmZkLtF5XcwohHDDqgX1944qTgD8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
