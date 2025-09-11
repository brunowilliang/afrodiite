import { auth } from '@/lib/auth/auth.server';

export async function createContextFromHeaders(headers: Headers) {
	const session = await auth.api.getSession({ headers });

	const vercelCountry = headers.get('x-vercel-ip-country');
	const vercelCity = headers.get('x-vercel-ip-city');
	const vercelRegion = headers.get('x-vercel-ip-region');

	const forwardedFor = headers.get('x-forwarded-for');
	const realIP = headers.get('x-real-ip');

	const geo = {
		country: vercelCountry,
		city: vercelCity,
		region: vercelRegion,
		forwardedFor,
		realIP,
	};

	console.log(geo);

	return { session, geo };
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

export async function createContext({ request }: { request: Request }) {
	return createContextFromHeaders(request.headers);
}

export type Context = Awaited<ReturnType<typeof createContextFromHeaders>>;
