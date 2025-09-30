import { RPCHandler } from '@orpc/server/fetch';
import { createContext } from '@/api/http/context/session';
import { appRouter } from '@/api/http/routes';

const handler = new RPCHandler(appRouter);

async function handleRequest(request: Request) {
	const context = await createContext();
	const { response } = await handler.handle(request, {
		prefix: '/api/rpc',
		context,
	});
	return response ?? new Response('Not Found', { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
