import { client } from '@/lib/client';
import type { Database } from '@/lib/client.types';

type EscortProfile = Database['public']['Tables']['escort_profiles']['Row'];

export type UpdateParams = {
	id: EscortProfile['id'];
	data: Partial<EscortProfile>;
};

export type GetParams = {
	id: EscortProfile['id'];
};

export const escortQueries = {
	getProfile: async (params: GetParams) => {
		const result = await client.db
			.from('escort_profiles')
			.select('*')
			.eq('id', params.id)
			.single();

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data;
	},

	updateProfile: async (params: UpdateParams) => {
		const result = await client.db
			.from('escort_profiles')
			.update(params.data)
			.eq('id', params.id);

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data;
	},

	deleteProfile: async () => {
		const result = await client.auth.deleteUser();

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data;
	},
};
