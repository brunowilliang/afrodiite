import { ORPCError } from '@orpc/server';
import { o } from '@/api/http/middlewares';
import { tryCatch } from '@/utils/tryCatch';

export const ErrorMiddleware = o.middleware(({ next }) => {
	const [error, result] = tryCatch(async () => await next());

	if (error) {
		console.error('ORPC Error Details:', {
			message: error.message,
			stack: error.stack,
			cause: error.cause,
		});
		throw new ORPCError('INTERNAL_SERVER_ERROR');
	}

	return result;
});
