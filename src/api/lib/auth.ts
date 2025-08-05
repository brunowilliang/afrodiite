import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { reactStartCookies } from 'better-auth/react-start';
import { database } from '@/api/db';
import { env } from '@/lib/env';
import { createUserProfile, deleteCustomer } from '../routes/user';

export type UserRole = 'user' | 'escort';

export type IUser = typeof auth.$Infer.Session.user;

export const auth = betterAuth({
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
					console.log('user', data);
					await deleteCustomer({
						customerId: data.polar_customer_id,
					});
				} catch (error) {
					console.error('Error deleting user from Polar:', error);
					// Não impede a deleção do usuário se falhar no Polar
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
			polar_customer_id: {
				type: 'string',
				required: false,
				defaultValue: '',
				input: false,
			},
		},
	},
	plugins: [openAPI(), reactStartCookies()],
});
