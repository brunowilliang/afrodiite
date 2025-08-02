import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/core/Stack';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = Route.useRouteContext();
	return (
		<Container hasHeader>
			<h1>Dashboard Page {session?.user?.name}</h1>
		</Container>
	)
}
