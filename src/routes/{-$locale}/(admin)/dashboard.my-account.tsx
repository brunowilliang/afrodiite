import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
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
			<Button
				onClick={async (e) => {
					e.preventDefault();
					const result = await api.checkout.open();

					if (result.error) {
						toast(result.error.message);
					}

					window.open(result.data?.url);
				}}
			>
				Checkout Normal
			</Button>
			<Button
				onClick={async (e) => {
					e.preventDefault();
					const result = await api.checkout.open();

					if (result.error) {
						toast(result.error.message);
					}

					window.open(result.data?.url);
				}}
			>
				Checkout Server
			</Button>
			<Button
				onClick={async (e) => {
					e.preventDefault();
					const result = await api.checkout.open();

					if (result.error) {
						toast(result.error.message);
					}

					window.open(result.data?.url);
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
