import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		BETTER_AUTH_SECRET: z.string(),
		DATABASE_URL: z.string().startsWith('libsql://'),
		DATABASE_AUTH_TOKEN: z.string().min(1),
		STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
		STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
		STRIPE_WEBHOOK_SECRET_2: z.string().startsWith('whsec_'),
		RESEND_API_KEY: z.string().startsWith('re_'),
		CLOUDFLARE_ENDPOINT: z.string(),
		CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1),
		CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1),
		GA_CLIENT_EMAIL: z.email(),
		GA_PRIVATE_KEY: z.string().min(1),
		GA_PROPERTY_ID: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_BETTER_AUTH_URL: z.string(),
		NEXT_PUBLIC_CORS_ORIGIN: z.string(),
	},
	skipValidation: true,
	runtimeEnv: {
		// Server
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		STRIPE_WEBHOOK_SECRET_2: process.env.STRIPE_WEBHOOK_SECRET_2,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
		CLOUDFLARE_ENDPOINT: process.env.CLOUDFLARE_ENDPOINT,
		CLOUDFLARE_ACCESS_KEY_ID: process.env.CLOUDFLARE_ACCESS_KEY_ID,
		CLOUDFLARE_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
		GA_CLIENT_EMAIL: process.env.GA_CLIENT_EMAIL,
		GA_PRIVATE_KEY: process.env.GA_PRIVATE_KEY,
		GA_PROPERTY_ID: process.env.GA_PROPERTY_ID,
		// Client
		NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
		NEXT_PUBLIC_CORS_ORIGIN: process.env.NEXT_PUBLIC_CORS_ORIGIN,
	},
});
