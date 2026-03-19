import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ivlbjochxaupsblqdwyq.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bGJqb2NoeGF1cHNibHFkd3lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDY1MTU3NywiZXhwIjoyMDgwMjI3NTc3fQ.Ebg8Y6duh6DE6EBNrW3WIekRrr80Wq5aHusSImSGjCA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
