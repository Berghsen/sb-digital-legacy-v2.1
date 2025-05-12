import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseANONKEY = process.env.REACT_APP_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseURL, supabaseANONKEY);