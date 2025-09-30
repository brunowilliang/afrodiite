'use client';

import {
	defaultShouldDehydrateQuery,
	isServer,
	QueryClient,
	QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query';
import type React from 'react';

type Props = {
	children: React.ReactNode;
};

export default function QueryClientProvider({ children }: Props) {
	function makeQueryClient() {
		return new QueryClient({
			defaultOptions: {
				queries: {
					// With SSR, we usually want to set some default staleTime
					staleTime: 60_000 * 5, // 5 minutos
				},
				dehydrate: {
					shouldDehydrateQuery: (query) =>
						defaultShouldDehydrateQuery(query) ||
						query.state.status === 'pending',
				},
			},
		});
	}

	let browserQueryClient: QueryClient | undefined;

	function getQueryClient() {
		if (isServer) {
			// Server: always create a new QueryClient per request
			return makeQueryClient();
		}
		// Browser: reuse a singleton to avoid re-creation during suspense
		if (!browserQueryClient) {
			browserQueryClient = makeQueryClient();
		}
		return browserQueryClient;
	}

	const queryClient = getQueryClient();

	return (
		<TanstackQueryClientProvider client={queryClient}>
			{children}
		</TanstackQueryClientProvider>
	);
}
