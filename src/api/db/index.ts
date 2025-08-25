import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schemas from '@/api/db/schemas';
import { env } from '@/utils/env';

const client = postgres(env.DATABASE_URL, {
	prepare: false,
	max: 10, // Máximo de 10 conexões no pool
	idle_timeout: 20, // Timeout de conexões inativas (20 segundos)
	connect_timeout: 10, // Timeout de conexão (10 segundos)
	transform: {
		undefined: null, // Transforma undefined em null para PostgreSQL
	},
});

export const db = drizzle(client);

export const database = drizzleAdapter(db, {
	provider: 'pg',
	schema: schemas,
	usePlural: true,
});
