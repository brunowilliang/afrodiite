import { stripeClient } from '@better-auth/stripe/client';
import { createClient } from '@supabase/supabase-js';
import { createAuthClient } from 'better-auth/react';
import { env } from '@/env';
import type { Database } from './database.types';

const betterAuthClient = createAuthClient({
	baseURL: env.VITE_BETTER_AUTH_URL,
	plugins: [
		stripeClient({
			subscription: true,
		}),
	],
});

const supabaseClient = createClient<Database>(
	env.VITE_SUPABASE_URL,
	env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

// ✅ Client-only exports
export const api = {
	auth: betterAuthClient,
	supabase: supabaseClient as Omit<typeof supabaseClient, 'auth'>,
} as const;
