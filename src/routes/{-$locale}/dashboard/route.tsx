import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/{-$locale}/dashboard')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<h1>HEADER</h1>
			<Outlet />
		</>
	)
}
