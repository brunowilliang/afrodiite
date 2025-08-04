import { polarClient } from '@polar-sh/better-auth';
import { createClient } from '@supabase/supabase-js';
import { createAuthClient } from 'better-auth/react';
import type { Database } from './client.types';

const betterAuth = createAuthClient({
	baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
	plugins: [polarClient()],
});

const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export const client = {
	auth: betterAuth,
	db: supabase as Omit<typeof supabase, 'auth'>,
} as const;
