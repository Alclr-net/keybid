import { createClient } from "@supabase/supabase-js";

// HIGH-03: Validate env vars at startup — fail loudly rather than silently
// initialising a broken admin client that crashes on first DB call.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseServiceKey) throw new Error("Missing env var: SUPABASE_SECRET_KEY");

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        // Service-role clients must never persist sessions or auto-refresh tokens
        persistSession: false,
        autoRefreshToken: false,
    },
});
