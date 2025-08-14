import { publicProcedure } from '../middlewares/auth';

export const sessionRoutes = publicProcedure.handler(async ({ context }) => {
	return context.session;
});
