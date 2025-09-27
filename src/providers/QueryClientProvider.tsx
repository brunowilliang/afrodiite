'use client';

import { StandardRPCJsonSerializer } from '@orpc/client/standard';
import {
	QueryClient,
	QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';

const serializer = new StandardRPCJsonSerializer();

type Props = {
	children: React.ReactNode;
};

export default function QueryClientProvider({ children }: Props) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// With SSR, we usually want to set some default staleTime
						// above 0 to avoid refetching immediately on the client
						staleTime: 1000 * 60 * 5, // 5 minutos (correto)
						gcTime: 1000 * 60 * 30, // 30 minutos (CORRETO - não cacheTime)
						refetchOnWindowFocus: false,
						refetchOnReconnect: false,
						queryKeyHashFn: (queryKey) => {
							const [json, meta] = serializer.serialize(queryKey);
							return JSON.stringify({ json, meta });
						},
					},
					dehydrate: {
						serializeData(data) {
							const [json, meta] = serializer.serialize(data);
							return { json, meta };
						},
					},
					hydrate: {
						deserializeData(data) {
							return serializer.deserialize(data.json, data.meta);
						},
					},
				},
			}),
	);

	return (
		<TanstackQueryClientProvider client={queryClient}>
			{children}
		</TanstackQueryClientProvider>
	);
}
