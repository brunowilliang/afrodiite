import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { createCrud } from '@/api/db';
import { escortProfiles } from '@/api/db/schemas';
import { publicProcedure } from '@/api/http/middlewares';

const escorts = createCrud(escortProfiles, {
	searchFields: ['artist_name', 'city', 'district'],
	allowedFilters: ['artist_name', 'city', 'district'],
	scopeFilters: {
		is_active: () => eq(escortProfiles.is_active, true),
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
		console.log('🔍 API Debug:');
		console.log('input.public_id:', input.public_id);
		console.log('typeof input.public_id:', typeof input.public_id);

		// Vamos ver o que tem na tabela
		const allProfiles = await escorts.list({ page: 1, perPage: 10 });
		console.log('🔍 Primeiros 10 perfis:', allProfiles);

		// Vamos ver se existe algum com public_id = 1962
		const profile = await escorts.findOne({ public_id: input.public_id });
		console.log('Profile found:', profile);

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
