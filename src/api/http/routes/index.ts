import { escortRoutes } from './escorts';
import { profileRoutes } from './profile';
import { sessionRoutes } from './session';
import { storageRoutes } from './storage';

export const appRouter = {
	session: sessionRoutes,
	profile: profileRoutes,
	escorts: escortRoutes,
	storage: storageRoutes,
};

export type AppRouter = typeof appRouter;
