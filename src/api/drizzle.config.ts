import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from '@/utils/env';

export default defineConfig({
	schema: './src/api/db/schemas',
	out: './src/api/db/migrations',
	dialect: 'postgresql',
	schemaFilter: ['public'],
	dbCredentials: {
		url: env.DATABASE_URL,
		ssl: { rejectUnauthorized: false },
	},
});
