import { Webhooks } from '@polar-sh/tanstack-start';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { env } from '@/lib/env';

export const ServerRoute = createServerFileRoute('/api/webhooks').methods({
	POST: Webhooks({
		webhookSecret: env.POLAR_WEBHOOK_SECRET,
		onPayload: async (payload) => {
			console.log('🔄 Webhook payload:', payload);
		},
	}),
});
