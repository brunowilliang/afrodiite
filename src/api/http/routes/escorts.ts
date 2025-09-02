import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { createCrud } from '@/api/db';
import { escortProfiles } from '@/api/db/schemas';
import { publicProcedure } from '@/api/http/middlewares';

const escorts = createCrud(escortProfiles, {
	searchFields: ['artist_name', 'city', 'district'],
	allowedFilters: ['artist_name', 'city', 'district'],
	scopeFilters: {
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

export const escortRoutes = {
	detail: publicProcedure.input(Detail.input).handler(async ({ input }) => {
		const profile = await escorts.findOne({ public_id: input.public_id });

		return profile;
	}),
	list: publicProcedure.input(List.input).handler(async ({ input }) => {
		const profiles = await escorts.list({
			page: input.page,
			perPage: 20,
			search: input.search,
		});

		return profiles;
	}),
};
