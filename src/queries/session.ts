import type { QueryClient } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { api } from '@/lib/api/server';

export const getSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		const { headers } = getWebRequest();
		const session = await api.auth.getSession({ headers });

		return session || null;
	},
);

// Função para prefetch da sessão
export const prefetchSession = async (queryClient: QueryClient) => {
	await queryClient.prefetchQuery({
		queryKey: ['session'],
		queryFn: () => getSession(),
	});
};

// Função para pegar sessão do cache com tipagem correta
export const getSessionFromCache = (queryClient: QueryClient) => {
	return queryClient.getQueryData(['session']) as Awaited<
		ReturnType<typeof getSession>
	> | null;
};
