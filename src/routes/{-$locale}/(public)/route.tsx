import { createFileRoute } from '@tanstack/react-router';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';

export const Route = createFileRoute('/{-$locale}/(public)')({
	component: RouteComponent,
});

// function RouteComponent() {
// 	return (
// 		<>
// 			<Header />
// 			<Outlet />
// 			<Footer />
// 		</>
// 	);
// }
function RouteComponent() {
	return (
		<Container>
			<Stack>
				<Text>Welcome to Afrodiite.com</Text>
			</Stack>
		</Container>
	);
}
