import { Button } from '@heroui/react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';

const ActivateSchema = z.object({
	error: z.string().optional(),
});

export const Route = createFileRoute('/{-$locale}/(public)/activate')({
	validateSearch: ActivateSchema,
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (context.session?.user?.emailVerified) {
			return redirect({ to: '/{-$locale}/dashboard' });
		}
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const goHome = () => navigate({ to: '/{-$locale}' });

	return (
		<Container className="centered h-screen">
			<Stack className="centered w-full space-y-10">
				<Stack className="w-full max-w-md items-center space-y-4">
					<Text as="h4" align="center" className="text-danger">
						Ops!
						<br />
						Ocorreu um erro ao verificar seu email
					</Text>
					<Button fullWidth size="lg" onPress={goHome}>
						Ir para a home
					</Button>
				</Stack>
			</Stack>
		</Container>
	);
}
