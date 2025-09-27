import { ORPCError, os } from '@orpc/server';
import { Context } from '../context/session';

export const o = os.$context<Context>();

export const publicProcedure = o;

export const AuthMiddleware = o.middleware(async ({ context, next }) => {
	if (!context.session) {
		throw new ORPCError('UNAUTHORIZED');
	}
	return next({
		context: {
			session: context.session,
		},
	});
});

export const authProcedure = publicProcedure.use(AuthMiddleware);
