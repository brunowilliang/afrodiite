import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/auth/server';

const { GET: originalGET, POST: originalPOST } = toNextJsHandler(auth.handler);

export const GET = (request: Request) => {
	console.log(`🔄 [AUTH]:GET ${request.url}`);
	return originalGET(request);
};

export const POST = (request: Request) => {
	console.log(`🔄 [AUTH]:POST ${request.url}`);
	return originalPOST(request);
};
