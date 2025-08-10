import { router } from 'react-query-kit';
import z from 'zod';
import { api } from '@/lib/api/client';

const signInSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
});

const signUpSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	password: z.string().min(1),
});

type SignUpData = z.infer<typeof signUpSchema>;
type SignInData = z.infer<typeof signInSchema>;

export const auth = router('auth', {
	signOut: router.mutation({
		mutationFn: async () => {
			const { data, error } = await api.auth.signOut();
			if (error) throw error;
			return data;
		},
	}),
	signIn: router.mutation({
		mutationFn: async (variables: SignInData) => {
			const { data, error } = await api.auth.signIn.email({
				email: variables.email,
				password: variables.password,
			});
			if (error) throw error;
			return data;
		},
	}),
	signUp: router.mutation({
		mutationFn: async (variables: SignUpData) => {
			const { data, error } = await api.auth.signUp.email({
				name: variables.name,
				email: variables.email,
				password: variables.password,
			});
			if (error) throw error;
			return data;
		},
	}),
	delete: router.mutation({
		mutationFn: async () => {
			const { data, error } = await api.auth.deleteUser();
			if (error) throw error;
			return data;
		},
	}),
});
