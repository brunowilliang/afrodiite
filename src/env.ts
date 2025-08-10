import { z } from 'zod';

// Schema completo
const envSchema = z.object({
	// Client variables (VITE_*)
	VITE_BETTER_AUTH_URL: z.string().url(),
	VITE_CORS_ORIGIN: z.string().url(),
	VITE_SUPABASE_URL: z.string().url(),
	VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
	VITE_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_').optional(),

	// Server variables
	BETTER_AUTH_SECRET: z.string(),
	DATABASE_URL: z.string().url().startsWith('postgresql://'),
	DATABASE_POOL_URL: z.string().url().startsWith('postgresql://'),
	STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
	STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
	STRIPE_WEBHOOK_SECRET_2: z.string().startsWith('whsec_'),
});

// Schema apenas para cliente
const clientSchema = z.object({
	VITE_BETTER_AUTH_URL: z.string().url(),
	VITE_CORS_ORIGIN: z.string().url(),
	VITE_SUPABASE_URL: z.string().url(),
	VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
	VITE_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_').optional(),
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
		const { errors } = z.treeifyError(err);
		const errorMessage = Object.entries(errors)
			.map(([field, errors]) => (errors ? `${field}: ${errors}` : field))
			.join('\n');

		throw new Error(`Missing environment variables:\n  ${errorMessage}`);
	}
}

export const env = envVars as z.output<typeof envSchema>;
