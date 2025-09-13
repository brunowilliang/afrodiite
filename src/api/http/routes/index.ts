import { analyticsRoutes } from './analytics';
import { escortRoutes } from './escorts';
import { profileRoutes } from './profile';
import { reviewsRoutes } from './reviews';
import { sessionRoutes } from './session';
import { storageRoutes } from './storage';

export const appRouter = {
	session: sessionRoutes,
	profile: profileRoutes,
	escorts: escortRoutes,
	storage: storageRoutes,
	analytics: analyticsRoutes,
	reviews: reviewsRoutes,
};

export type AppRouter = typeof appRouter;
