import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a lazy-loaded Supabase client
// This prevents errors during module initialization/build if env vars are missing
let cachedClient: any = null;

function initClient() {
  if (cachedClient) return cachedClient;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  cachedClient = createClient(supabaseUrl, supabaseKey);
  return cachedClient;
}

// Export a proxy that initializes client lazily
export const supabase = new Proxy(
  {},
  {
    get: (target, prop) => {
      const client = initClient();
      return (client as any)[prop];
    },
  },
);
