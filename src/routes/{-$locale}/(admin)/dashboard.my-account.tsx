import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { client } from '@/lib/client';
import { getSubscriptions } from '@/lib/fetchAuthSession';

export const Route = createFileRoute(
	'/{-$locale}/(admin)/dashboard/my-account',
)({
	component: RouteComponent,
	loader: async ({ context }) => {
		const { user } = context.session ?? {};

		if (!user) {
			throw new Error('User not found');
		}

		const { subscriptions } = await getSubscriptions();

		return {
			subscriptions,
		};
	},
});

function RouteComponent() {
	const { subscriptions } = Route.useLoaderData();

	const openCheckout = async () => {
		const result = await client.auth.checkout({
			slug: 'premium',
		});

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data.redirect;
	};

	const openPortal = async () => {
		const result = await client.auth.customer.portal();

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data.redirect;
	};

	const deleteUser = async () => {
		const { data, error } = await client.auth.deleteUser();

		if (error) {
			throw new Error(error.message);
		}

		console.log('data', data);

		return data;
	};

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
			<Button onClick={openCheckout}>Checkout</Button>
			<Button onClick={openPortal}>Portal</Button>
			<Button variant="unstyled-danger" onClick={deleteUser}>
				Delete User
			</Button>
		</Container>
	);
}
