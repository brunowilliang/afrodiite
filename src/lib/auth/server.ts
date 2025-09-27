import { stripe } from '@better-auth/stripe';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { openAPI } from 'better-auth/plugins';
import Stripe from 'stripe';
import { database } from '@/api/database';
import { createAuthId } from '@/api/utils/generateId';
import { env } from '@/env';
import { tryCatch } from '@/utils/tryCatch';
import { sendEmail } from '../email';
import ConfirmYourAccount from '../email/templates/confirm-your-account';
import ResetPassword from '../email/templates/reset-password';
import { createUserProfile, deleteCustomer } from './user';

export type UserRole = 'user' | 'escort';

export type IUser = typeof auth.$Infer.Session.user & {
	stripeCustomerId: string;
};

export type ISession = typeof auth.$Infer.Session;

export type SessionData = {
	session: typeof auth.$Infer.Session;
	user: IUser;
};

export const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: '2025-08-27.basil',
});

export const auth = betterAuth({
	appName: 'Afrodiite',
	database,
	advanced: {
		database: {
			generateId: () => createAuthId(),
		},
	},
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
	trustedOrigins: [
		env.NEXT_PUBLIC_CORS_ORIGIN,
		'afrodiite://',
		'http://localhost:3000',
	],
	logger: {
		level: 'debug',
		disabled: false,
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			const [error] = await tryCatch(
				sendEmail({
					to: user.email,
					subject: 'Afrodiite • Redefina sua senha',
					text: `Clique para redefinir: ${url}`,
					react: ResetPassword({ name: user.name, url: url }),
				}),
			);
			if (error) console.error('Error sending reset email:', error);
		},
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url, token }) => {
			console.log(user, url, token);
			const [error] = await tryCatch(
				sendEmail({
					to: user.email,
					subject: 'Afrodiite • Confirme sua conta',
					react: ConfirmYourAccount({
						name: user.name,
						url,
					}),
				}),
			);

			if (error) {
				console.error('Error sending verification email:', error);
			}
		},
		onEmailVerification: async () => {
			console.log('onEmailVerification');
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600,
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					try {
						await createUserProfile({
							id: user.id,
							name: user.name,
							email: user.email,
						});
					} catch (error) {
						console.error('Error creating user profile:', error);
					}
				},
			},
		},
	},
	user: {
		deleteUser: {
			enabled: true,
			beforeDelete: async (user) => {
				const data = user as IUser;
				try {
					await deleteCustomer({
						stripeCustomerId: data.stripeCustomerId ?? '',
					});
				} catch (error) {
					console.error('Error deleting user from Stripe:', error);
				}
			},
		},
		additionalFields: {
			role: {
				type: 'string',
				required: true,
				defaultValue: 'escort',
				input: false,
				validate: (value: string): boolean => {
					const validRoles: UserRole[] = ['user', 'escort'];
					return validRoles.includes(value as UserRole);
				},
			},
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 dias - sessão expira em 7 dias
		updateAge: 60 * 60 * 24, // 24 horas - renova sessão a cada 24h de uso
		cookieCache: {
			enabled: true, // Cache de cookies habilitado
			maxAge: 60 * 60 * 24 * 7, // 7 dias de cache
		},
	},
	plugins: [
		openAPI(),
		nextCookies(),
		stripe({
			stripeClient,
			stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
			createCustomerOnSignUp: true,
			subscription: {
				enabled: true,
				plans: [
					{
						name: 'premium',
						priceId: 'price_1RsnojBnGb6BkxW7TV1Ijzfa',
					},
				],
			},
		}),
	],
});
