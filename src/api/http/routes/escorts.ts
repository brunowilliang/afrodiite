import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { createCrud } from '@/api/database';
import { escortProfiles } from '@/api/database/schemas';
import { publicProcedure } from '@/api/http/middlewares';
import { reviews } from './reviews';

const escorts = createCrud(escortProfiles, {
	searchFields: ['artist_name', 'city', 'district'],
	allowedFilters: ['artist_name', 'city', 'district', 'blocked_countries'],
	scopeFilters: {
		is_onboarding_complete: () =>
			eq(escortProfiles.is_onboarding_complete, true),
		is_visible: () => eq(escortProfiles.is_visible, true),
	},
});

const Detail = {
	input: z.object({
		public_id: z.coerce.number(),
	}),
};

const List = {
	input: z.object({
		search: z.string().optional(),
		page: z.number().optional(),
	}),
};

const Reviews = {
	input: z.object({
		public_id: z.coerce.number(),
	}),
};

export const escortRoutes = {
	detail: publicProcedure.input(Detail.input).handler(async ({ input }) => {
		const profile = await escorts.findOne({ public_id: input.public_id });

		return profile;
	}),
	reviews: publicProcedure.input(Reviews.input).handler(async ({ input }) => {
		const result = await reviews.list({
			filters: {
				public_id: input.public_id,
				status: {
					in: ['approved'],
				},
			},
		});
		return result;
	}),
	list: publicProcedure
		.input(List.input)
		.handler(async ({ input, context }) => {
			const country = context.location.country;

			const profiles = await escorts.list({
				page: input.page,
				perPage: 20,
				search: input.search,
				filters: {
					blocked_countries: {
						notLike: `%"${country}"%`,
					},
				},
			});

			return profiles;
		}),
};
