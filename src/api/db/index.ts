import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schemas from '@/api/db/schemas';
import { env } from '@/lib/env';

const client = postgres(env.DATABASE_URL, {
	prepare: false,
});

export const db = drizzle(client);

export const database = drizzleAdapter(db, {
	provider: 'pg',
	schema: schemas,
	usePlural: true,
});
