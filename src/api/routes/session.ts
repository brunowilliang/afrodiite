import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import z from 'zod';
import { auth } from '@/api/lib/auth';

export const getSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		const request = getWebRequest();
		const session = await auth.api.getSession({ headers: request.headers });

		return { session: session ?? null };
	},
);

export const getSubscriptions = createServerFn({ method: 'GET' }).handler(
	async () => {
		const request = getWebRequest();

		const { result } = await auth.api.subscriptions({
			headers: request.headers,
			query: {
				active: true,
			},
		});

		if (!result) {
			throw new Error('No subscriptions found');
		}

		return { subscriptions: result };
	},
);

export const openPortal = createServerFn({ method: 'GET' })
	.validator(
		z.object({
			slug: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const request = getWebRequest();

		const result = await auth.api.portal({
			headers: request.headers,
			params: {
				slug: data.slug,
			},
		});

		return { url: result.url };
	});
