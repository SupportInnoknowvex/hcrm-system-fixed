// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://uaulkkjyrxmmatkfqobs.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhdWxra2p5cnhtbWF0a2Zxb2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NzUzMjYsImV4cCI6MjA3NTE1MTMyNn0.drKOByAtKKJoJXsWN5VKljVRRibX1Xi5Pv9_hS_7M-Q"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
