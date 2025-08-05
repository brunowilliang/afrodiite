import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { api } from '@/api/routes';
import { Button } from '@/components/core/Button';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { client } from '@/lib/client';

export const Route = createFileRoute(
	'/{-$locale}/(admin)/dashboard/my-account',
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = Route.useRouteContext();
	const navigate = Route.useNavigate();

	// Usa a mutation já configurada no api
	const deleteMutation = api.profile.delete();

	const handleUpgrade = async () => {
		const response = await client.auth.subscription.upgrade({
			plan: 'premium',
			successUrl: `${window.location.origin}/dashboard/my-account?success=true`,
			cancelUrl: `${window.location.origin}/dashboard/my-account`,
		});

		if (response.error) {
			toast.error('Erro ao processar pagamento');
		}
	};

	const handleDelete = () => {
		deleteMutation.mutate(undefined, {
			onSuccess: () => {
				toast.success('Usuário deletado com sucesso');
				navigate({ to: '/{-$locale}' });
			},
			onError: (error) => {
				console.log('error', error);
				toast.error('Erro ao deletar usuário', {
					description: error.message,
				});
			},
		});
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
				<Text>Perfil Ativo: NÃO</Text>
			</Stack>
			<Button onClick={handleUpgrade}>Seja Premium</Button>

			<Button variant="unstyled-danger" onClick={handleDelete}>
				Delete User
			</Button>
		</Container>
	);
}
