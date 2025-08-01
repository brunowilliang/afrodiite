import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/{-$locale}/dashboard/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<h1>Dashboard Page</h1>
		</div>
	)
}
