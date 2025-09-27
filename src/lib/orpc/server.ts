import 'server-only';

import { createRouterClient } from '@orpc/server';
import { createContext } from '@/api/http/context/session';
import { appRouter } from '@/api/http/routes';

globalThis.$client = createRouterClient(appRouter, {
	context: async () => {
		return createContext();
	},
});
