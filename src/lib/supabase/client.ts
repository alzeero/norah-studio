import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "./env";

/** Supabase client for use inside Client Components (browser). */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
