import { auth } from '@/lib/auth/auth.server';

export async function createContextFromHeaders(headers: Headers) {
	const session = await auth.api.getSession({ headers });

	return { session };
}

export async function createContext({ request }: { request: Request }) {
	return createContextFromHeaders(request.headers);
}

export type Context = Awaited<ReturnType<typeof createContextFromHeaders>>;
