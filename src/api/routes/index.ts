import { useMutation } from '@tanstack/react-query';
import { openCheckout } from './checkout';
import { escortQueries, type GetParams } from './escort';
import { getPortal, getSession } from './session';

export const api = {
	session: {
		get: () => getSession(),
	},
	subscriptions: {
		get: () => {},
	},
	checkout: {
		open: () => useMutation({ mutationFn: openCheckout }),
	},
	portal: {
		open: () => useMutation({ mutationFn: getPortal }),
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
