import { getWebRequest } from '@tanstack/react-start/server';
import { geolocation, ipAddress } from '@vercel/functions';
import { auth } from '@/lib/auth/auth.server';

export async function createContext() {
	const { headers } = getWebRequest();

	const session = await auth.api.getSession({ headers });
	const locationData = geolocation({ headers });
	const ip = ipAddress({ headers });

	const location = {
		ip,
		...locationData,
	};

	return { session, location };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
