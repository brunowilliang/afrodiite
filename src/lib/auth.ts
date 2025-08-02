import { betterAuth } from 'better-auth';
import { reactStartCookies } from 'better-auth/react-start';

import { database } from '@/db';

export type UserRole = 'user' | 'escort';

export const auth = betterAuth({
	appName: 'Afrodiite',
	database,
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.VITE_BETTER_AUTH_URL,
	trustedOrigins: [process.env.VITE_CORS_ORIGIN || '', 'afrodiite://'],
	emailAndPassword: {
		enabled: true,
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
	plugins: [reactStartCookies()],
});
