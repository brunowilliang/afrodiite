import { drizzle } from 'drizzle-orm/libsql';
import { reset } from 'drizzle-seed';
import { env } from '@/utils/env';
import * as schema from './schemas';

const seedDb = drizzle({
	connection: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN,
	},
});

export async function resetDatabase() {
	console.time('reset');
	await reset(seedDb, schema);
	console.log('🗑️ Database reset completed');
	console.timeEnd('reset');
}

if (require.main === module) {
	resetDatabase().catch(console.error);
}
