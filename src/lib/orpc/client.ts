import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import type { appRouter } from '@/api/http/routes';

declare global {
	var $client: RouterClient<typeof appRouter> | undefined;
}

const link = new RPCLink({
	url: () => {
		if (typeof window === 'undefined') {
			throw new Error('RPCLink is not allowed on the server side.');
		}

		return `${window.location.origin}/api/rpc`;
	},
});

// ✅ Client e server exports
export const orpc: RouterClient<typeof appRouter> =
	globalThis.$client ?? createORPCClient(link);

// ✅ Tanstack Query Utils
export const queries = createTanstackQueryUtils(orpc);

// // ✅ exports para usar no client e server com o tanstack query utils
// export const api = {
// 	auth,
// 	orpc,
// 	queries,
// } as const;

// // exempos de uso:
