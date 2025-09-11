import { getWebRequest } from '@tanstack/react-start/server';
import { geolocation } from '@vercel/functions';
import { auth } from '@/lib/auth/auth.server';

export async function createContext() {
	const { headers } = getWebRequest();

	const session = await auth.api.getSession({ headers });
	const geoData = geolocation({ headers });

	return { session, geoData };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
