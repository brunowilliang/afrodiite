import { router } from 'react-query-kit';
import type { z } from 'zod';
import { api } from '@/lib/api/client';
import type { escortProfilesSchema } from '@/schemas/forms/profile';

export type ProfileData = z.infer<typeof escortProfilesSchema>;
type ProfileUpdate = Partial<ProfileData> & { id: string };

export const profile = router('profile', {
	byId: router.query({
		fetcher: async (variables: ProfileUpdate) => {
			const { data } = await api.supabase
				.from('escort_profiles')
				.select('*')
				.eq('id', variables.id)
				.single();

			return data;
		},
	}),
	update: router.mutation({
		mutationFn: async (variables: ProfileUpdate) => {
			const { data, error } = await api.supabase
				.from('escort_profiles')
				.update(variables as any)
				.eq('id', variables.id)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
	}),
});
