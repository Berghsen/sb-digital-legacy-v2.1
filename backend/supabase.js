import { createClient } from "@supabase/supabase-js";
require('dotenv').config(); // Important to load .env variables

const supabaseURL = process.env.SUPABASE_URL;
const supabaseANONKEY = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseURL, supabaseANONKEY);