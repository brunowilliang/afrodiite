import { useMutation } from '@tanstack/react-query';
import { escortQueries, type GetParams } from './escort';
import { getSession, openCheckout, openPortal } from './session';

export const api = {
	session: {
		get: () => getSession(),
	},
	subscriptions: {
		get: () => {},
	},
	checkout: {
		open: () => openCheckout(),
	},
	portal: {
		open: (customerId: string) => openPortal({ data: { customerId } }),
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
