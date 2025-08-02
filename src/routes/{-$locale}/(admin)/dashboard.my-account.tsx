import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/core/Stack';

export const Route = createFileRoute(
	'/{-$locale}/(admin)/dashboard/my-account',
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Container hasHeader>
			<h1>Dashboard Page - minha-conta</h1>
		</Container>
	)
}
