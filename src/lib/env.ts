import { z } from 'zod';

/**
 * Universal environment validation for both Node.js and Browser contexts
 * Auto-detects the environment and uses the appropriate API
 *
 * Features:
 * - Auto-initialization on first access
 * - Production error monitoring and alerts
 * - Type-safe environment variable access
 * - Context-aware validation (browser vs Node.js)
 */

// Complete environment variables schema
const envSchema = z.object({
	// Client environment variables (VITE_*)
	VITE_BETTER_AUTH_URL: z
		.string()
		.url('VITE_BETTER_AUTH_URL must be a valid URL'),
	VITE_CORS_ORIGIN: z.string().url('VITE_CORS_ORIGIN must be a valid URL'),
	VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL must be a valid URL'),
	VITE_SUPABASE_PUBLISHABLE_KEY: z
		.string()
		.min(1, 'VITE_SUPABASE_PUBLISHABLE_KEY is required'),

	// Server environment variables
	BETTER_AUTH_SECRET: z
		.string()
		.min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),
	POLAR_ACCESS_TOKEN: z
		.string()
		.startsWith('polar_oat_', 'POLAR_ACCESS_TOKEN must start with polar_oat_'),
	POLAR_WEBHOOK_SECRET: z
		.string()
		.startsWith(
			'polar_whs_',
			'POLAR_WEBHOOK_SECRET must start with polar_whs_',
		),
	POLAR_ACCESS_TOKEN_SANDBOX: z
		.string()
		.startsWith(
			'polar_oat_',
			'POLAR_ACCESS_TOKEN_SANDBOX must start with polar_oat_',
		),
	POLAR_WEBHOOK_SECRET_SANDBOX: z
		.string()
		.startsWith(
			'polar_whs_',
			'POLAR_WEBHOOK_SECRET_SANDBOX must start with polar_whs_',
		),
	DATABASE_URL: z
		.string()
		.url('DATABASE_URL must be a valid URL')
		.startsWith(
			'postgresql://',
			'DATABASE_URL must be a PostgreSQL connection string',
		),
	DATABASE_POOL_URL: z
		.string()
		.url('DATABASE_POOL_URL must be a valid URL')
		.startsWith(
			'postgresql://',
			'DATABASE_POOL_URL must be a PostgreSQL connection string',
		),
});

type EnvType = z.infer<typeof envSchema>;

// Client variables that are available in browser
const clientVars = [
	'VITE_BETTER_AUTH_URL',
	'VITE_CORS_ORIGIN',
	'VITE_SUPABASE_URL',
	'VITE_SUPABASE_PUBLISHABLE_KEY',
] as const;

// Environment detection
const isClient = typeof window !== 'undefined';
const isProduction = process.env.NODE_ENV === 'production';

// Error reporting function
const reportError = (error: string, context: Record<string, any> = {}) => {
	const errorMessage = `🚨 ENV ERROR: ${error}`;
	const errorContext = {
		timestamp: new Date().toISOString(),
		environment: isClient ? 'browser' : 'node',
		nodeEnv: process.env.NODE_ENV,
		...context,
	};

	// Always log to console
	console.error(errorMessage, errorContext);

	// Call custom handler if configured
	const customHandler = (globalThis as any).__envErrorHandler;
	if (customHandler && typeof customHandler === 'function') {
		try {
			customHandler(error, errorContext);
		} catch (handlerError) {
			console.error('❌ Error in custom error handler:', handlerError);
		}
	}

	// In production, you can integrate with error monitoring services
	if (isProduction) {
		// TODO: Integrate with your error monitoring service
		// Examples:
		// - Sentry: Sentry.captureException(new Error(error), { extra: errorContext });
		// - Bugsnag: Bugsnag.notify(new Error(error), { metaData: errorContext });
		// - LogRocket: LogRocket.captureException(new Error(error));
		// - Custom webhook: fetch('/api/error-webhook', { method: 'POST', body: JSON.stringify({ error, context: errorContext }) });

		// For now, we'll create a custom event that you can listen to
		if (typeof window !== 'undefined') {
			// Browser: dispatch custom event
			window.dispatchEvent(
				new CustomEvent('env-validation-error', {
					detail: { error, context: errorContext },
				}),
			);
		} else {
			// Node.js: you could send to a logging service or webhook
			console.error(
				'🚨 PRODUCTION ENV ERROR - Consider setting up error monitoring!',
				{
					error,
					context: errorContext,
				},
			);
		}
	}
};

// Cache for validated values
const envCache = new Map<string, string>();

// Get raw value from the appropriate source
const getRawEnvValue = (key: string): string | undefined => {
	// In browser context: use import.meta.env if available, fallback to window
	if (isClient) {
		// Check if import.meta.env is available (Vite context)
		try {
			if (import.meta && import.meta.env) {
				return import.meta.env[key];
			}
		} catch {
			// import.meta not available in this context
		}
		// Fallback for other browser contexts
		return undefined;
	}

	// In Node.js context: use process.env
	return process.env[key];
};

// Validate and cache a single environment variable
const getValidatedEnvValue = (key: keyof EnvType): string => {
	// Check cache first
	if (envCache.has(key)) {
		const cached = envCache.get(key);
		if (cached !== undefined) {
			return cached;
		}
	}

	// Security check: prevent server vars from being accessed on client
	if (isClient && !clientVars.includes(key as any)) {
		throw new Error(
			`❌ Server environment variable '${key}' cannot be accessed from client side`,
		);
	}

	// Get raw value
	const rawValue = getRawEnvValue(key);
	if (rawValue === undefined) {
		const errorMsg = `Environment variable '${key}' is not defined`;
		reportError(errorMsg, { key, environment: isClient ? 'browser' : 'node' });
		throw new Error(`❌ ${errorMsg}`);
	}

	// Validate with Zod schema
	try {
		const validated = envSchema.shape[key].parse(rawValue);
		envCache.set(key, validated);
		return validated;
	} catch (error) {
		if (error instanceof z.ZodError) {
			const message = error.errors[0]?.message || 'Validation failed';
			const errorMsg = `Invalid '${key}': ${message}`;
			reportError(errorMsg, {
				key,
				rawValue: rawValue?.substring(0, 20) + '...', // Only show first 20 chars for security
				zodError: error.errors,
				environment: isClient ? 'browser' : 'node',
			});
			throw new Error(`❌ ${errorMsg}`);
		}
		reportError(`Unexpected error validating '${key}'`, {
			key,
			error: String(error),
		});
		throw error;
	}
};

// Auto-initialize on first access
let hasInitialized = false;

// Universal env object with auto-initialization
export const env = new Proxy({} as EnvType, {
	get(_, prop) {
		if (!hasInitialized) {
			console.log('🔧 Auto-initializing environment validation...');
			hasInitialized = true;

			// Validate environment variables based on context
			try {
				if (isClient) {
					// In browser: only validate client vars
					for (const key of clientVars) {
						getValidatedEnvValue(key);
					}
					console.log('✅ Client environment auto-initialized');
				} else {
					// In Node.js: validate all vars
					for (const key of Object.keys(envSchema.shape)) {
						getValidatedEnvValue(key as keyof EnvType);
					}
					console.log('✅ Node.js environment auto-initialized');
				}
				console.log(
					'🎉 Environment auto-initialization completed successfully',
				);
			} catch (error) {
				const errorMsg = 'Environment auto-initialization failed';
				reportError(errorMsg, {
					error: error instanceof Error ? error.message : String(error),
					environment: isClient ? 'browser' : 'node',
				});
				console.error('❌ Environment validation failed:', error);
				throw error;
			}
		}

		if (typeof prop !== 'string' || !(prop in envSchema.shape)) {
			throw new Error(`❌ Unknown environment variable: ${String(prop)}`);
		}
		return getValidatedEnvValue(prop as keyof EnvType);
	},
});

// Legacy exports for backward compatibility (optional)
export const getClientEnv = () => {
	const result: Record<string, string> = {};
	for (const key of clientVars) {
		result[key] = env[key];
	}
	return result as any;
};

export const getServerEnv = () => {
	if (isClient) {
		throw new Error('Server environment cannot be accessed from client side');
	}
	const result: Record<string, string> = {};
	for (const key of Object.keys(envSchema.shape)) {
		if (!clientVars.includes(key as any)) {
			result[key] = env[key as keyof EnvType];
		}
	}
	return result as any;
};

// Initialize environment validation (optional manual initialization)
export const initializeEnv = () => {
	console.log('🔧 Manually initializing environment validation...');

	try {
		if (isClient) {
			// In browser: only validate client vars
			for (const key of clientVars) {
				env[key];
			}
			console.log('✅ Client environment initialized');
		} else {
			// In Node.js: validate all vars
			for (const key of Object.keys(envSchema.shape)) {
				env[key as keyof EnvType];
			}
			console.log('✅ Node.js environment initialized');
		}

		console.log('🎉 Environment validation completed successfully');
		return true;
	} catch (error) {
		console.error('💥 Environment initialization failed:', error);
		return false;
	}
};

// Test utilities
export const testConnections = async () => {
	const results = {
		client: false,
		database: false,
		polar: false,
		supabase: false,
	};

	try {
		// Test client env
		getClientEnv();
		results.client = true;
		console.log('✅ Client environment variables validated');
	} catch (error) {
		console.error('❌ Client environment validation failed:', error);
	}

	// Only test server connections on server side
	if (!isClient) {
		try {
			const serverEnv = getServerEnv();
			console.log('✅ Server environment variables validated');

			// Test database connection
			try {
				// Simple connection test
				if (serverEnv.DATABASE_URL && serverEnv.DATABASE_POOL_URL) {
					results.database = true;
					console.log('✅ Database URLs are valid');
				}
			} catch (error) {
				console.error('❌ Database validation failed:', error);
			}

			// Test Polar configuration
			try {
				if (
					serverEnv.POLAR_ACCESS_TOKEN &&
					serverEnv.POLAR_WEBHOOK_SECRET &&
					serverEnv.POLAR_ACCESS_TOKEN_SANDBOX &&
					serverEnv.POLAR_WEBHOOK_SECRET_SANDBOX
				) {
					results.polar = true;
					console.log('✅ Polar configuration is valid');
				}
			} catch (error) {
				console.error('❌ Polar validation failed:', error);
			}

			// Test Supabase configuration
			try {
				const clientEnv = getClientEnv();
				if (
					clientEnv.VITE_SUPABASE_URL &&
					clientEnv.VITE_SUPABASE_PUBLISHABLE_KEY
				) {
					results.supabase = true;
					console.log('✅ Supabase configuration is valid');
				}
			} catch (error) {
				console.error('❌ Supabase validation failed:', error);
			}
		} catch (error) {
			console.error('❌ Server environment validation failed:', error);
		}
	}

	return results;
};

// Error monitoring configuration
export const configureErrorMonitoring = (
	handler: (error: string, context: Record<string, any>) => void,
) => {
	// Store the custom handler
	(globalThis as any).__envErrorHandler = handler;
};

// Browser event listener setup
export const setupBrowserErrorListener = () => {
	if (typeof window !== 'undefined') {
		window.addEventListener('env-validation-error', (event: Event) => {
			const customEvent = event as CustomEvent;
			console.warn(
				'🚨 Environment validation error detected:',
				customEvent.detail,
			);
			// You can add custom logic here, like showing a toast notification
		});
	}
};

// Health check function
export const checkEnvironmentHealth = () => {
	const results = {
		healthy: true,
		errors: [] as string[],
		warnings: [] as string[],
		environment: isClient ? 'browser' : 'node',
		timestamp: new Date().toISOString(),
	};

	try {
		if (isClient) {
			// Check client variables
			for (const key of clientVars) {
				try {
					env[key];
				} catch (error) {
					results.healthy = false;
					results.errors.push(
						`${key}: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}
		} else {
			// Check all variables in Node.js
			for (const key of Object.keys(envSchema.shape)) {
				try {
					env[key as keyof EnvType];
				} catch (error) {
					results.healthy = false;
					results.errors.push(
						`${key}: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}
		}
	} catch (error) {
		results.healthy = false;
		results.errors.push(
			`General validation error: ${error instanceof Error ? error.message : String(error)}`,
		);
	}

	return results;
};

// Type export for convenience
export type { EnvType };
