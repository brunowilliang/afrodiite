import { auth } from '@/lib/auth/client';
import { orpc, queries } from './client';

// ✅ exports para usar no client e server com o tanstack query utils
export const api = {
	auth,
	orpc,
	queries,
} as const;
