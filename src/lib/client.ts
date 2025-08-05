import { stripeClient } from '@better-auth/stripe/client';
import { createClient } from '@supabase/supabase-js';
import { createAuthClient } from 'better-auth/react';
import type { Database } from './client.types';
import { env } from './env';

const betterAuth = createAuthClient({
	baseURL: env.VITE_BETTER_AUTH_URL,
	plugins: [
		stripeClient({
			subscription: true,
		}),
	],
});

const supabase = createClient<Database>(
	env.VITE_SUPABASE_URL,
	env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export const client = {
	auth: betterAuth,
	db: supabase as Omit<typeof supabase, 'auth'>,
} as const;
