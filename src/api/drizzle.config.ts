// import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from '@/env';

export default defineConfig({
	schema: './src/api/database/schemas',
	out: './src/api/database/migrations',
	dialect: 'turso',
	dbCredentials: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN,
	},
});
