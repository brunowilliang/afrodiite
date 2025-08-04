import { useMutation } from '@tanstack/react-query';
import { client } from '@/lib/client';
import { escortQueries, type GetParams } from './escort';
import { getSession, getSubscriptions, openCheckout } from './session';

export const api = {
	session: {
		get: () => getSession(),
	},
	subscriptions: {
		get: () => getSubscriptions(),
	},
	checkout: {
		open: async ({ slug }: { slug: string }) => {
			const result = await client.auth.checkout({
				slug,
			});

			if (result.error) {
				throw new Error(result.error.message);
			}

			return result.data;
		},
		openServer: (slug: string) => openCheckout({ data: { slug } }),
	},
	portal: {
		open: async () => {
			const result = await client.auth.customer.portal();

			if (result.error) {
				throw new Error(result.error.message);
			}

			return result.data;
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
