'use server';

import { ORPCError, os } from '@orpc/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { createContext } from '@/api/http/context/session';
import { reviews } from '@/api/http/routes/reviews';

export const updateReview = os
	.input(
		z.object({
			id: z.number(),
			status: z.enum(['pending', 'approved', 'rejected']),
		}),
	)
	.handler(async ({ input }) => {
		const context = await createContext();

		if (!context.session) {
			throw new ORPCError('UNAUTHORIZED');
		}

		revalidateTag('reviews');
		return reviews.update(input.id, input);
	})
	.actionable({
		context: async () => ({}),
	});
