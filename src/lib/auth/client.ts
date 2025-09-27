import { stripeClient } from '@better-auth/stripe/client';
import { createAuthClient } from 'better-auth/client';
import z from 'zod';
import { env } from '@/env';

export const auth = createAuthClient({
	baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
	plugins: [
		stripeClient({
			subscription: true,
		}),
	],
});

export const signInSchema = z.object({
	email: z.email('E-mail inválido'),
	password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

export const signUpSchema = z.object({
	name: z.string().min(3, 'Nome muito curto'),
	email: z.email('E-mail inválido'),
	password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

export const forgotSchema = z.object({
	email: z.email('E-mail inválido'),
});
