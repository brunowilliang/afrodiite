import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import { createRouterClient } from '@orpc/server';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { createIsomorphicFn } from '@tanstack/react-start';
import { createContext } from '@/api/http/context/session';
import { appRouter } from '@/api/http/routes';
import { auth } from './auth/auth.client';

const getORPCClient = createIsomorphicFn()
	.server(() =>
		createRouterClient(appRouter, {
			context: async () => {
				return createContext();
			},
		}),
	)
	.client((): RouterClient<typeof appRouter> => {
		const link = new RPCLink({
			url: `${window.location.origin}/api/rpc`,
		});

		return createORPCClient(link);
	});

export const client: RouterClient<typeof appRouter> = getORPCClient();

export const queries = createTanstackQueryUtils(client);

export const api = {
	auth,
	client,
	queries,
} as const;
