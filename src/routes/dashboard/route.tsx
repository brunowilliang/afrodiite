import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<h1>HEADER</h1>
			<Outlet />
		</>
	);
}
