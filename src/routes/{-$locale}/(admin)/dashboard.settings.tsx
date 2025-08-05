import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/core/Stack';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/settings')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Container hasHeader>
			<h1>Dashboard Page - settings</h1>
		</Container>
	)
}
