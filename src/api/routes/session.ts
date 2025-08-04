import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { auth } from '@/api/lib/auth';

export const getSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		const request = getWebRequest();
		const session = await auth.api.getSession({ headers: request.headers });

		return { session: session ?? null };
	},
);
