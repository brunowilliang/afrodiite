import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/{-$locale}/dashboard/$slug')({
	component: RouteComponent,
	loader: async ({ params }) => {
		return params;
	},
});

function RouteComponent() {
	const { slug } = Route.useParams();

	return (
		<div>
			<h1>Dashboard: {slug}</h1>
		</div>
	)
}
