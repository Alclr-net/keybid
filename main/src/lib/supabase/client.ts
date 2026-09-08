// lib/supabase/client.ts
// Frontend-safe Supabase client. Uses the PUBLISHABLE key only.
// This client respects RLS policies — safe to import anywhere in the frontend.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing Supabase frontend env vars (URL or PUBLISHABLE_KEY)')
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)