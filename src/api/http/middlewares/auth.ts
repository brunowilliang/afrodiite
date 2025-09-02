import { ORPCError } from '@orpc/server';
import { o } from '@/api/http/middlewares';

export const AuthMiddleware = o.middleware(async ({ context, next }) => {
	if (!context.session?.user) {
		throw new ORPCError('UNAUTHORIZED');
	}
	return next({
		context: {
			session: context.session,
		},
	});
});
