import { getWebRequest } from '@tanstack/react-start/server';
import { geolocation } from '@vercel/functions';
import { auth } from '@/lib/auth/auth.server';

export async function createContext() {
	const { headers } = getWebRequest();

	const session = await auth.api.getSession({ headers });
	const geoData = geolocation({ headers });

	console.log(geoData);

	return { session, geoData };
}

// export async function createContextFromRequest(request: Request) {
// 	const { headers } = getWebRequest();

// 	const vercelCountry = request.headers.get('x-vercel-ip-country');
//   const vercelCity = request.headers.get('x-vercel-ip-city');
//   const vercelRegion = request.headers.get('x-vercel-ip-region');

//   // IP do usuário
//   const forwardedFor = request.headers.get('x-forwarded-for');
//   const realIP = request.headers.get('x-real-ip');

// 	return { session };
// }

// export async function createContext() {
// 	return createContextFromHeaders();
// }

export type Context = Awaited<ReturnType<typeof createContext>>;
