// Validação de variáveis de ambiente
function validateEnv() {
	const requiredVars = [
		'VITE_BETTER_AUTH_URL',
		'VITE_SUPABASE_URL',
		'VITE_SUPABASE_PUBLISHABLE_KEY',
	];

	const missing = requiredVars.filter((varName) => !import.meta.env[varName]);

	if (missing.length > 0) {
		console.error('❌ Variáveis de ambiente faltando:', missing);
		if (import.meta.env.PROD) {
			throw new Error(
				`Missing required environment variables: ${missing.join(', ')}`,
			);
		}
	}
}

// Chame no modo desenvolvimento para debug
if (import.meta.env.DEV) {
	validateEnv();
}

export const env = {
	BETTER_AUTH_URL: import.meta.env.VITE_BETTER_AUTH_URL,
	SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
	SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
	IS_PROD: import.meta.env.PROD,
	IS_DEV: import.meta.env.DEV,
} as const;
