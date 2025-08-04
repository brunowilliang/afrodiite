import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Header } from '@/components/dashboard/Header';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard')({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const { session, profile } = context;

		if (!session) {
			throw redirect({ to: '/{-$locale}' });
		}

		if (!profile) {
			throw redirect({ to: '/{-$locale}' });
		}

		return { session, profile };
	},
});

function RouteComponent() {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
}
