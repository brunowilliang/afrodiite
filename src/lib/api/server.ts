import { betterAuthServer } from '@/api/lib/auth';

export const api = {
	auth: betterAuthServer.api,
	handler: betterAuthServer.handler,
} as const;

export type Session = typeof betterAuthServer.$Infer.Session;
