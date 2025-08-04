import { createFileRoute } from '@tanstack/react-router';
import { api } from '@/api/routes';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';

export const Route = createFileRoute(
	'/{-$locale}/(admin)/dashboard/my-account',
)({
	component: RouteComponent,
	loader: async () => {
		const { subscriptions } = await api.subscriptions.get();

		return {
			subscriptions,
		};
	},
});

function RouteComponent() {
	const { subscriptions } = Route.useLoaderData();

	return (
		<Container hasHeader>
			<Text size="2xl" weight="bold">
				Minha Conta
			</Text>

			<Stack direction="row" className="gap-2">
				<Text>Perfil Ativo Polar:</Text>
				{subscriptions && subscriptions.items.length > 0 ? (
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
				)}
			</Stack>
			<Button
				onClick={async (e) => {
					e.preventDefault();
					const result = await api.checkout.open({
						slug: 'premium',
					});

					window.open(result.url);
				}}
			>
				Checkout
			</Button>
			<Button
				onClick={async (e) => {
					e.preventDefault();
					const result = await api.portal.open();

					window.open(result.url);
				}}
			>
				Portal
			</Button>
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
