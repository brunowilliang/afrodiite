import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/{-$locale}/dashboard')({
	component: Outlet,
	beforeLoad: async ({ context }) => {
		const { session } = context;
		if (!session) {
			throw redirect({ to: '/{-$locale}' });
		}
	},
});
