import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dxgxsftwwwleddnsthad.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4Z3hzZnR3d3dsZWRkbnN0aGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NDQ5NzUsImV4cCI6MjA1NzEyMDk3NX0.JsopNBrxm7BwWTupmuz4Xe3W4opB2eLwT4q0FavQc0M';

export const supabase = createClient(supabaseUrl, supabaseKey);