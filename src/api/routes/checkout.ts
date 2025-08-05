import { createServerFn } from '@tanstack/react-start';
import { polar } from '@/api/lib/polar';

export const openCheckout = createServerFn({ method: 'GET' }).handler(
	async () => {
		const result = await polar.checkouts.create({
			products: ['70347f1f-cced-484a-b0e9-44272f10d3c4'],
		});

		if (!result) {
			throw new Error('Failed to create checkout');
		}

		return result.url;
	},
);
