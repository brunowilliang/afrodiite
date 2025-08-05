import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { auth } from '@/api/lib/auth';
import { polar } from '../lib/polar';

export const getSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		const request = getWebRequest();
		const session = await auth.api.getSession({ headers: request.headers });

		return { session: session ?? null };
	},
);

export const getPortal = createServerFn({ method: 'GET' }).handler(async () => {
	const request = getWebRequest();
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session) {
		throw new Error('User not authenticated');
	}

	const result = await polar.customerSessions.create({
		customerId: session.user.polar_customer_id ?? '',
	});

	return result.customerPortalUrl;
});

export const getSubscription = createServerFn({ method: 'GET' }).handler(
	async () => {
		const request = getWebRequest();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			throw new Error('User not authenticated');
		}

		const result = await polar.subscriptions.list({
			customerId: session.user.polar_customer_id ?? '',
			page: 1,
			limit: 10,
		});

		return null;
	},
);
