import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rzikmmcseshoetnovebl.supabase.co'   // URL project Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6aWttbWNzZXNob2V0bm92ZWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDI3MjgsImV4cCI6MjA3MjkxODcyOH0.WUTszlWRfz7iYL0-sMgs5OJB8_nVFGjHvv_MMSu38dE'       // key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
