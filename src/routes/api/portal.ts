import { CustomerPortal } from '@polar-sh/tanstack-start';
import {
	createServerFileRoute,
	getWebRequest,
} from '@tanstack/react-start/server';
import { auth } from '@/api/lib/auth';
import { env } from '@/lib/env';

export const ServerRoute = createServerFileRoute('/api/portal').methods({
	GET: async () => {
		const request = getWebRequest();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			throw new Error('User not authenticated');
		}

		return CustomerPortal({
			accessToken: env.POLAR_ACCESS_TOKEN_SANDBOX,
			getCustomerId: async () => {
				return session.user.polar_customer_id ?? '';
			},
			server: 'sandbox',
		});
	},
});
