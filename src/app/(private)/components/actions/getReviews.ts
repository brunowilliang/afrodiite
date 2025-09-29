'use server';

import { unstable_cacheTag as cacheTag } from 'next/cache';
import { createContext } from '@/api/http/context/session';
import { reviews } from '@/api/http/routes/reviews';

export async function getReviews() {
	const context = await createContext();

	if (!context.session) return undefined;

	async function cachedFn() {
		'use cache';
		cacheTag('reviews');

		if (!context.session) return undefined;

		const result = await reviews.list({
			filters: {
				escort_id: context.session.user.id,
			},
			orderBy: [
				{
					field: 'created_at',
					direction: 'desc',
				},
			],
			perPage: 100,
		});

		return result;
	}

	return cachedFn();
}
