/* ------------------------------------------------------------------------ */
/*  Supabase client. Null when the Supabase env vars aren't configured so    */
/*  the app can show a friendly "auth not configured" state instead of       */
/*  crashing.                                                                */
/* ------------------------------------------------------------------------ */

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null

export const isAuthConfigured = supabase !== null