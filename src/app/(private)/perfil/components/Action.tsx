'use server';

import { ORPCError, os } from '@orpc/server';
import { z } from 'zod';
import { createContext } from '@/api/http/context/session';
import { profile } from '@/api/http/routes/profile';
import { reviews } from '@/api/http/routes/reviews';
import { profileUpdateSchema } from '@/api/utils/schemas/escort-forms';

export const updateProfile = os
	.input(profileUpdateSchema)
	.handler(async ({ input }) => {
		const context = await createContext();

		if (!context.session) {
			throw new ORPCError('UNAUTHORIZED');
		}

		const result = await profile.update(context.session.user.id, input);
		return result;
	})
	.actionable({
		context: async () => ({}),
	});

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

		return reviews.update(input.id, input);
	})
	.actionable({
		context: async () => ({}),
	});
