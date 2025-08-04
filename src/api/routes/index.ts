import { useMutation } from '@tanstack/react-query';
import { client } from '@/lib/client';
import { escortQueries, type GetParams } from './escort';
import { getSession } from './session';

export const api = {
	session: {
		get: () => getSession(),
	},
	subscriptions: {
		get: () => {},
	},
	checkout: {
		open: async () => {
			const response = await client.auth.checkout({
				slug: 'premium',
			});
			return response;
		},
	},
	portal: {
		open: async () => {
			const response = client.auth.customer.portal();

			return response;
		},
	},
	profile: {
		get: (params: GetParams) => ({
			queryKey: ['profile', params.id],
			queryFn: () => escortQueries.getProfile({ id: params.id }),
		}),
		update: () =>
			useMutation({
				mutationFn: escortQueries.updateProfile,
			}),
		delete: () =>
			useMutation({
				mutationFn: escortQueries.deleteProfile,
			}),
	},
};
