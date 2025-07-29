import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export const Route = createFileRoute('/(public)')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Header />
			<Outlet />
			<Footer />
		</>
	);
}
