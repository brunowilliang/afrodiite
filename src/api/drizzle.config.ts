import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/api/db/schemas',
	out: './src/api/db/migrations',
	dialect: 'postgresql',
	schemaFilter: ['public'],
	dbCredentials: {
		url: process.env.DATABASE_URL || '',
		ssl: { rejectUnauthorized: false },
	},
});
