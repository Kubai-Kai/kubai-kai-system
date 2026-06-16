import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://swnsxlgtfqcwbkydsbhi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bnN4bGd0ZnFjd2JreWRzYmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTE1NTcsImV4cCI6MjA5NzE4NzU1N30.6mQk2PESNf7iqmnFa3H1zgFZ85ji2Haeknm7RV2sAI4'

export const supabase = createClient(supabaseUrl, supabaseKey)
