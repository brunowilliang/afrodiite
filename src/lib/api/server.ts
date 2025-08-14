import { auth } from '@/lib/auth/auth.server';

export const api = {
	auth: auth.api,
	handler: auth.handler,
} as const;

export type Session = typeof auth.$Infer.Session;
