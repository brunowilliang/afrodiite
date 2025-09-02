import { stripeClient } from '@better-auth/stripe/client';
import { createAuthClient } from 'better-auth/react';
import { env } from '@/utils/env';

const betterAuthClient = createAuthClient({
	baseURL: env.VITE_BETTER_AUTH_URL,
	plugins: [
		stripeClient({
			subscription: true,
		}),
	],
});

// ✅ Client-only exports
export const api = {
	auth: betterAuthClient,
} as const;
