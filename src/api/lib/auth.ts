import { stripe } from '@better-auth/stripe';
import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { reactStartCookies } from 'better-auth/react-start';
import Stripe from 'stripe';
import { database } from '@/api/db';
import { env } from '@/env';
import { createUserProfile, deleteCustomer } from './user';

export type UserRole = 'user' | 'escort';
export type IUser = typeof betterAuthServer.$Infer.Session.user;

export const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: '2025-07-30.basil',
});

export const betterAuthServer = betterAuth({
	appName: 'Afrodiite',
	database,
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.VITE_BETTER_AUTH_URL,
	trustedOrigins: [
		env.VITE_CORS_ORIGIN,
		'afrodiite://',
		'http://localhost:3000',
	],
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
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
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
	plugins: [
		openAPI(),
		reactStartCookies(),
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
