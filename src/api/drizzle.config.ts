import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from '@/utils/env';

export default defineConfig({
	schema: './src/api/db/schemas',
	out: './src/api/db/migrations',
	dialect: 'turso',
	dbCredentials: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN,
	},
});


