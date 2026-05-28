import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://suonhjautzinjeqkcxqj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1b25oamF1dHppbmplcWtjeHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NDcxNzAsImV4cCI6MjA5NTQyMzE3MH0.dC2xISXSmeNEqE1_MN_OTZCgLmimmvWW7s7iDw9xcKU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
