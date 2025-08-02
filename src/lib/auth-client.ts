import { createAuthClient } from 'better-auth/react';

export const {
	useSession,
	getSession,
	signIn,
	signUp,
	signOut,
	deleteUser,
	updateUser,
} = createAuthClient({
	baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
	plugins: [],
});
