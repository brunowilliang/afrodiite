import { useMutation } from '@tanstack/react-query';
import { openCheckout } from './checkout';
import { escortQueries, type GetParams } from './escort';
import { getSession, openPortal } from './session';

export const api = {
	session: {
		get: () => getSession(),
	},
	subscriptions: {
		get: () => {},
	},
	checkout: {
		open: () =>
			useMutation({
				mutationFn: openCheckout,
			}),
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
