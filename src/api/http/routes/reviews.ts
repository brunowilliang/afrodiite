import z from 'zod';
import { createCrud } from '@/api/database';
import { escortReviews } from '@/api/database/schemas/reviews';
import { authProcedure, publicProcedure } from '@/api/http/middlewares';
import { ReviewSchema } from '@/api/utils/schemas/reviews';

// ✅ Drizzle-CRUD setup
const reviews = createCrud(escortReviews, {
	allowedFilters: ['status'],
});

const input = z.object({
	status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
});

export const reviewsRoutes = {
	create: publicProcedure
		.input(ReviewSchema.input)
		.handler(async ({ input, context }) => {
			return reviews.create({
				...input,
				ip_address: context.location.ip,
			});
		}),
	list: authProcedure.input(input).handler(async ({ input, context }) => {
		const result = await reviews.list({
			filters: {
				escort_id: context.session.user.id,
				status: input.status,
			},
			perPage: 30,
		});

		return result;
	}),
	update: authProcedure
		.input(
			z.object({
				id: z.number(),
				status: z.enum(['pending', 'approved', 'rejected']),
			}),
		)
		.handler(async ({ input }) => {
			return reviews.update(input.id, { ...input });
		}),
};
