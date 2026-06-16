import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://swnsxlgtfqcwbkydsbhi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bnN4bGd0ZnFjd2JreWRzYmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTE1NTcsImV4cCI6MjA5NzE4NzU1N30.6mQk2PESNf7iqmnFa3H1zgFZ85ji2Haeknm7RV2sAI4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);