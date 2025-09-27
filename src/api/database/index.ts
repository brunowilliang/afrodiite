import { drizzleCrud } from '@bwg-labs/drizzle-crud';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/libsql';
import * as schemas from '@/api/database/schemas';
import { env } from '@/env';

export const db = drizzle({
	schema: schemas,
	connection: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN,
	},
});

export const database = drizzleAdapter(db, {
	provider: 'sqlite',
	schema: schemas,
	usePlural: true,
});

export const createCrud = drizzleCrud(db);
