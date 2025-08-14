import { createServerFileRoute } from '@tanstack/react-start/server';
import { auth } from '@/lib/auth/auth.server';

export const ServerRoute = createServerFileRoute('/api/auth/$').methods({
	GET: ({ request }) => {
		console.log('🔄 GET request to:', request.url);
		return auth.handler(request);
	},
	POST: ({ request }) => {
		console.log('🔄 POST request to:', request.url);
		return auth.handler(request);
	},
});
