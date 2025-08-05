import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { auth } from '@/api/lib/auth';
import { polar } from '@/api/lib/stripe';
import { env } from '@/lib/env';

export const openCheckout = createServerFn({ method: 'GET' }).handler(
	async () => {
		const request = getWebRequest();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			throw new Error('User not authenticated');
		}

		const result = await polar.checkouts.create({
			customerId: session.user.polar_customer_id,
			successUrl: `${env.VITE_BETTER_AUTH_URL}/dashboard`,
			products: ['70347f1f-cced-484a-b0e9-44272f10d3c4'],
		});

		if (!result) {
			throw new Error('Failed to create checkout');
		}

		console.log('✅ Checkout created successfully:', result.url);

		return result.url;
	},
);
