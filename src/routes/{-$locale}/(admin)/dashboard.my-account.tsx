import { createFileRoute } from '@tanstack/react-router';
import { api } from '@/api/routes';
import { Button } from '@/components/core/Button';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';

export const Route = createFileRoute(
	'/{-$locale}/(admin)/dashboard/my-account',
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { profile, session } = Route.useRouteContext();

	// Usa a mutation já configurada no api
	const checkoutMutation = api.checkout.open();

	const handleCheckout = () => {
		checkoutMutation.mutate(undefined, {
			onSuccess: (checkoutUrl) => {
				// Redireciona para o checkout do Polar
				window.location.href = checkoutUrl;
			},
			onError: (error) => {
				console.error('Erro ao abrir checkout:', error);
			},
		});
	};

	const handleCheckoutSDK = () => {
		// Usa a Server Route do Polar SDK com query params
		const checkoutUrl =
			'/api/checkout?products=70347f1f-cced-484a-b0e9-44272f10d3c4';
		window.location.href = checkoutUrl;
	};

	if (!session) {
		console.log('Não há session');
	}

	return (
		<Container hasHeader>
			<Text size="2xl" weight="bold">
				Minha Conta
			</Text>

			<Stack direction="row" className="gap-2">
				<Text>Perfil Ativo Polar:</Text>
				{/* {subscriptions && subscriptions.items.length > 0 ? (
					<Stack>
						{subscriptions.items.map((item) => (
							<Card key={item.id}>
								<Text>{item.product.name}</Text>
								<Text>{item.status}</Text>
								<Text>{item.amount}</Text>
							</Card>
						))}
					</Stack>
				) : (
					'Não'
				)} */}
			</Stack>
			<Button onClick={handleCheckout} disabled={checkoutMutation.isPending}>
				{checkoutMutation.isPending
					? 'Abrindo Checkout...'
					: 'Checkout API Routes'}
			</Button>

			<Button onClick={handleCheckoutSDK}>Checkout SDK (Server Route)</Button>

			<Button
				variant="unstyled-danger"
				onClick={() => {
					api.profile.delete().mutate();
				}}
			>
				Delete User
			</Button>
		</Container>
	);
}
