import { profileRoutes } from './profile';
import { sessionRoutes } from './session';

export const appRouter = {
	session: sessionRoutes,
	profile: profileRoutes,
};

export type AppRouter = typeof appRouter;
