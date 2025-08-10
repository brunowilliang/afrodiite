import { createFileRoute } from '@tanstack/react-router';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';

export const Route = createFileRoute(
	'/{-$locale}/(admin)/dashboard/my-account',
)({
	component: RouteComponent,
});

function RouteComponent() {
	// const { session } = Route.useRouteContext();
	// const { profile } = useLoaderData({ from: '/{-$locale}/(admin)/dashboard' });

	// console.log('profile my-account', profile);

	// const navigate = Route.useNavigate();
	// const deleteMutation = api.profile.delete();
	// const subscription = api.subscriptions.upgrade();

	// const handlePremiumPlan = () => {
	// 	subscription.mutate(undefined, {
	// 		onSuccess: (data) => {
	// 			console.log('Premium plan opened successfully', data);
	// 			window.location.href = data?.url ?? '';
	// 		},
	// 		onError: (error) => {
	// 			console.log('error', error);
	// 			toast.error('Erro ao abrir o checkout');
	// 		},
	// 	});
	// };

	// const handleDelete = () => {
	// 	deleteMutation.mutate(undefined, {
	// 		onSuccess: () => {
	// 			toast.success('Usuário deletado com sucesso');
	// 			navigate({ to: '/{-$locale}' });
	// 		},
	// 		onError: (error) => {
	// 			console.log('error', error);
	// 			toast.error('Erro ao deletar usuário', {
	// 				description: error.message,
	// 			});
	// 		},
	// 	});
	// };

	// if (!session) {
	// 	console.log('Não há session');
	// }

	return (
		<Container hasHeader>
			<Text size="2xl" weight="bold">
				Minha Conta
			</Text>

			<Stack direction="row" className="gap-2">
				<Text>Perfil Ativo: NÃO</Text>
			</Stack>
			{/* <Button onClick={handlePremiumPlan} disabled={subscription.isPending}>
				{subscription.isPending ? 'Abrindo checkout...' : 'Seja Premium'}
			</Button>

			<Button variant="unstyled-danger" onClick={handleDelete}>
				Delete User
			</Button> */}
		</Container>
	);
}
