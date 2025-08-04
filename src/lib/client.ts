import { polarClient } from '@polar-sh/better-auth';
import { createClient } from '@supabase/supabase-js';
import { createAuthClient } from 'better-auth/react';
import type { Database } from './client.types';
import { env } from './env';

const betterAuth = createAuthClient({
	baseURL:
		env.BETTER_AUTH_URL ||
		(env.IS_DEV ? 'http://localhost:3000' : window.location.origin),
	plugins: [polarClient()],
});

const supabase = createClient<Database>(
	env.SUPABASE_URL || '',
	env.SUPABASE_PUBLISHABLE_KEY || '',
);

export const client = {
	auth: betterAuth,
	db: supabase as Omit<typeof supabase, 'auth'>,
} as const;
