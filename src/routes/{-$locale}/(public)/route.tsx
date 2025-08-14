import { createFileRoute, Outlet, useMatchRoute } from '@tanstack/react-router';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export const Route = createFileRoute('/{-$locale}/(public)')({
	component: RouteComponent,
});

function RouteComponent() {
	const matchRoute = useMatchRoute();
	const isLogin = !!matchRoute({ to: '/{-$locale}/sign-in' });
	const isResetPassword = !!matchRoute({ to: '/{-$locale}/reset-password' });
	const isActivate = !!matchRoute({ to: '/{-$locale}/activate' });

	if (isLogin || isActivate || isResetPassword) {
		return <Outlet />;
	}

	return (
		<>
			<Header />
			<Outlet />
			<Footer />
		</>
	);
}
