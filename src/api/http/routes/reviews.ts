import { createCrud } from '@/api/database';
import { escortReviews } from '@/api/database/schemas/reviews';
import { authProcedure, publicProcedure } from '@/api/http/middlewares';
import { ReviewSchema } from '@/api/utils/schemas/reviews';

// ✅ Drizzle-CRUD setup
const reviews = createCrud(escortReviews);

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
			perPage: 30,
		});

		return result;
	}),
};
