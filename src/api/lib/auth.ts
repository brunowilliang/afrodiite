import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { reactStartCookies } from 'better-auth/react-start';
import { database, db } from '@/api/db';
import { escortProfiles } from '../db/schemas';
// import { polar, polarPlugin } from './polar';

export type UserRole = 'user' | 'escort';

export const auth = betterAuth({
	appName: 'Afrodiite',
	database,
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.VITE_BETTER_AUTH_URL,
	trustedOrigins: [
		process.env.VITE_CORS_ORIGIN || '',
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
						await db.insert(escortProfiles).values({
							id: user.id,
							name: user.name,
						});
					} catch (error) {
						console.error('Error creating escort profile:', error);
					}
				},
			},
		},
	},
	user: {
		deleteUser: {
			enabled: true,
			// afterDelete: async (user) => {
			// 	await polar.customers.deleteExternal({
			// 		externalId: user.id,
			// 	});
			// },
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
