import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Header } from '@/components/dashboard/Header';
import { api } from '@/lib/api';
import { tryCatch } from '@/utils/tryCatch';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard')({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.session) {
			return redirect({ to: '/{-$locale}' });
		}
	},
	loader: async () => {
		const [profileError, profile] = await tryCatch(api.client.profile.get());

		if (profileError) {
			console.warn('Profile error in dashboard:', profileError.message);
			return { profile: null };
		}

		return { profile };
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
