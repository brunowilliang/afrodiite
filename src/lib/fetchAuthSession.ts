import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { auth } from '@/api/lib/auth';

export const fetchAuthSession = createServerFn({ method: 'GET' }).handler(
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

export const getCustomerState = createServerFn({ method: 'GET' }).handler(
	async () => {
		const request = getWebRequest();

		const state = await auth.api.state({
			headers: request.headers,
			query: {
				active: true,
			},
		});

		if (!state) {
			throw new Error('No subscriptions found');
		}

		return { state };
	},
);
