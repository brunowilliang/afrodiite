import { z } from 'zod';

// Schema completo
const envSchema = z.object({
	// Client variables (VITE_*)
	VITE_BETTER_AUTH_URL: z.url(),
	VITE_CORS_ORIGIN: z.url(),

	// Server variables
	BETTER_AUTH_SECRET: z.string(),
	DATABASE_URL: z.url().startsWith('libsql://'),
	DATABASE_AUTH_TOKEN: z.string().min(1),
	STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
	STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
	STRIPE_WEBHOOK_SECRET_2: z.string().startsWith('whsec_'),
	RESEND_API_KEY: z.string().startsWith('re_'),

	CLOUDFLARE_ENDPOINT: z.url(),
	CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1),
	CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1),
});

// Schema apenas para cliente (só variáveis VITE_*)
const clientSchema = z.object({
	VITE_BETTER_AUTH_URL: z.url(),
	VITE_CORS_ORIGIN: z.url(),
});

const isServer = typeof window === 'undefined';

function getEnvVars() {
	if (isServer) {
		return process.env;
	}

	try {
		return import.meta.env;
	} catch {
		return process.env;
	}
}

const envVars = getEnvVars();

// Validação baseada no ambiente
try {
	if (isServer) {
		envSchema.parse(envVars);
	} else {
		clientSchema.parse(envVars);
	}
} catch (err) {
	if (err instanceof z.ZodError) {
		console.error('Environment validation failed:', err.issues);

		const missingVars = err.issues
			.map((issue) => {
				const field = issue.path.join('.');
				return `❌ ${field}: ${issue.message}`;
			})
			.join('\n  ');

		const currentEnv = Object.keys(envVars).filter((key) =>
			isServer ? true : key.startsWith('VITE_'),
		);

		console.log('Available env vars:', currentEnv);
		console.log('Environment type:', isServer ? 'SERVER' : 'CLIENT');

		throw new Error(`Missing environment variables:\n  ${missingVars}`);
	}
}

export const env = envVars as z.output<typeof envSchema>;
