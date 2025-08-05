import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { NotFound } from './components/NotFound';
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient();

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		defaultPreload: 'intent',
		defaultViewTransition: true,
		defaultErrorComponent: ({ error, reset }) => (
			<DefaultCatchBoundary error={error} reset={reset} />
		),
		notFoundMode: 'root',
		defaultNotFoundComponent: () => <NotFound />,
		scrollRestoration: true,
		scrollRestorationBehavior: 'instant',
		context: {
			queryClient,
		},
		Wrap: ({ children }) => {
			return (
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			);
		},
	});

	return router;
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
