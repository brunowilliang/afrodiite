import { createServerFileRoute } from '@tanstack/react-start/server';
import { auth } from '@/api/lib/auth';

export const ServerRoute = createServerFileRoute('/api/auth/$').methods({
	GET: ({ request }) => {
		console.log('🔄 GET request to:', request.url);
		return auth.handler(request);
	},
	POST: ({ request }) => {
		console.log('🔄 POST request to:', request.url);
		console.log('🔄 Headers:', Object.fromEntries(request.headers.entries()));
		return auth.handler(request);
	},
});
