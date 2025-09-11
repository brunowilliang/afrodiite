import { RPCHandler } from '@orpc/server/fetch';
import { getFilenameFromContentDisposition } from '@orpc/standard-server';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { createContext } from '@/api/http/context/session';
import { appRouter } from '@/api/http/routes';

const OVERRIDE_BODY_CONTEXT = Symbol('OVERRIDE_BODY_CONTEXT');

interface OverrideBodyContext {
	fetchRequest: Request;
}

const handler = new RPCHandler(appRouter, {
	adapterInterceptors: [
		(options) => {
			return options.next({
				...options,
				context: {
					...options.context,
					[OVERRIDE_BODY_CONTEXT as any]: {
						fetchRequest: options.request,
					},
				},
			});
		},
	],
	rootInterceptors: [
		// Body parser interceptor
		(options) => {
			const { fetchRequest } = (options.context as any)[
				OVERRIDE_BODY_CONTEXT
			] as OverrideBodyContext;

			return options.next({
				...options,
				request: {
					...options.request,
					async body() {
						const contentDisposition = fetchRequest.headers.get(
							'content-disposition',
						);
						const contentType = fetchRequest.headers.get('content-type');

						if (
							contentDisposition === null &&
							contentType?.startsWith('multipart/form-data')
						) {
							return fetchRequest.formData();
						}

						if (
							contentDisposition !== null ||
							(!contentType?.startsWith('application/json') &&
								!contentType?.startsWith('application/x-www-form-urlencoded'))
						) {
							const fileName =
								getFilenameFromContentDisposition(contentDisposition ?? '') ??
								'blob';
							const blob = await fetchRequest.blob();
							return new File([blob], fileName, {
								type: blob.type,
							});
						}

						return options.request.body();
					},
				},
			});
		},
	],
});

async function handle({ request }: { request: Request }) {
	const context = await createContext();

	const { response } = await handler.handle(request, {
		prefix: '/api/rpc',
		context,
	});

	return response ?? new Response('Not Found', { status: 404 });
}

export const ServerRoute = createServerFileRoute('/api/rpc/$').methods({
	HEAD: handle,
	GET: handle,
	POST: handle,
	PUT: handle,
	PATCH: handle,
	DELETE: handle,
});
