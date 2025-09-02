import { publicProcedure } from '@/api/http/middlewares';

export const sessionRoutes = publicProcedure.handler(async ({ context }) => {
	return context.session;
});
