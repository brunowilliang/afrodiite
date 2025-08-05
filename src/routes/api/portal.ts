import { CustomerPortal } from '@polar-sh/tanstack-start';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { env } from '@/lib/env';

export const ServerRoute = createServerFileRoute('/api/portal').methods({
	GET: CustomerPortal({
		accessToken: env.POLAR_ACCESS_TOKEN_SANDBOX,
		getCustomerId: async (request: Request) => {
			// Você precisa implementar esta função para pegar o customer ID
			// Provavelmente do Better Auth ou da sessão do usuário
			return ''; // Retorne o ID do customer do Polar aqui
		},
		server: 'sandbox',
	}),
});
