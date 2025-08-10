import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/adverts')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Container hasHeader>
			<Text size="2xl" weight="bold">
				Dashboard - Anuncios
			</Text>
		</Container>
	);
}
