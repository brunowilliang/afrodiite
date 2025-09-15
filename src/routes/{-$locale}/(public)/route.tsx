import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/core/Header';
import { Footer } from '@/components/Footer';

export const Route = createFileRoute('/{-$locale}/(public)')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<section className="mx-auto px-4">
				<Header />
			</section>
			<Outlet />
			<Footer />
		</>
	);
}
