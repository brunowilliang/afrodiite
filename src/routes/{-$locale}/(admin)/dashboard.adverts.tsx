import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/core/Stack';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/adverts')(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	return (
		<Container hasHeader>
			<h1>Dashboard Page - anuncios</h1>
		</Container>
	)
}
