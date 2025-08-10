import { createServerFileRoute } from '@tanstack/react-start/server';
import { api } from '@/lib/api/server';

export const ServerRoute = createServerFileRoute('/api/auth/$').methods({
	GET: ({ request }) => {
		console.log('🔄 GET request to:', request.url);
		return api.handler(request);
	},
	POST: ({ request }) => {
		console.log('🔄 POST request to:', request.url);
		return api.handler(request);
	},
});
