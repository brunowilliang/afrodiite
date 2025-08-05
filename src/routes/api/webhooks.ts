import { Webhooks } from '@polar-sh/tanstack-start';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { env } from '@/lib/env';

export const ServerRoute = createServerFileRoute('/api/webhooks').methods({
	GET: async ({ request }) => {
		console.log('🔍 GET request to webhooks endpoint');
		return new Response('Webhooks endpoint is working!', { status: 200 });
	},
	POST: Webhooks({
		webhookSecret: env.POLAR_WEBHOOK_SECRET,
		onPayload: async (payload) => {
			console.log('🔄 Webhook payload:', payload);
		},
	}),
});
