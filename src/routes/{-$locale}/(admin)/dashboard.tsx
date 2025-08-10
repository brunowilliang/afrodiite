import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Header } from '@/components/dashboard/Header';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard')({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.session) {
			return redirect({ to: '/{-$locale}' });
		}
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
