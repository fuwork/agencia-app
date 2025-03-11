import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvhymqggrunmuxgudljh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2aHltcWdncnVubXV4Z3VkbGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NjMyMTIsImV4cCI6MjA1NzEzOTIxMn0.suyRqurwzfrdtqeiXH5nRyxGvPb2alHC7LBIDbv5yaA';

export const supabase = createClient(supabaseUrl, supabaseKey);