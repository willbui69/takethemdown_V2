// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://euswzjdcxrnuupcyiddb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1c3d6amRjeHJudXVwY3lpZGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTE2MTIsImV4cCI6MjA2MzIyNzYxMn0.Yiy4i60R-1-K3HSwWAQSmPZ3FTLrq0Wd78s0yYRA8NE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);