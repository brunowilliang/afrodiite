import { geolocation, ipAddress } from '@vercel/functions';
import { headers as nextHeaders } from 'next/headers';
import { auth } from '@/lib/auth/server';
import { tryCatch } from '@/utils/tryCatch';

export async function createContext() {
	const headers = await nextHeaders();

	const [error, session] = await tryCatch(auth.api.getSession({ headers }));

	if (error) {
		console.warn('[ERROR]:', error.message);
	}

	const locationData = geolocation({ headers });
	const ip = ipAddress({ headers });

	const location = {
		ip,
		...locationData,
	};

	return { session, location };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
