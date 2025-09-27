import z from 'zod';
import { createCrud } from '@/api/database';
import { escortReviews } from '@/api/database/schemas/reviews';
import { authProcedure, publicProcedure } from '@/api/http/middlewares';
import { ReviewSchema } from '@/api/utils/schemas/reviews';

// ✅ Drizzle-CRUD setup
export const reviews = createCrud(escortReviews, {
	allowedFilters: ['status', 'escort_id'],
});

// const input = z.object({
// 	status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
// });

export const reviewsRoutes = {
	create: publicProcedure
		.input(ReviewSchema.input)
		.handler(async ({ input, context }) => {
			return reviews.create({
				...input,
				ip_address: context.location.ip,
			});
		}),
	list: authProcedure.handler(async ({ context }) => {
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
