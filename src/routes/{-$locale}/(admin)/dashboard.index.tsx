import { createFileRoute } from '@tanstack/react-router';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { Onboarding } from './-dashboard.profile/onboarding';
import { computeOnboardingCompletion } from './-dashboard.profile/schema';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { profile } = Route.useRouteContext();

	const completed = computeOnboardingCompletion((profile ?? {}) as any);
	const isOnboardingDone = completed.every(Boolean);

	return (
		<Container>
			<Stack className="gap-10">
				<Text size="2xl" weight="bold">
					Olá, {profile?.name} 👋
				</Text>
				{!isOnboardingDone ? (
					<Stack className="gap-1">
						<Text size="xl" weight="bold">
							Prepare o seu perfil para destacar 🚀
						</Text>
						<Text size="md" weight="light">
							Em poucos passos, construa um perfil que para o scroll, atrai
							olhares e transforma interesse em ação instantânea.
						</Text>
					</Stack>
				) : (
					<Stack className="gap-1">
						<Text size="xl" weight="bold">
							Dashboard
						</Text>
						<Text size="md" weight="light">
							Bem-vinda ao seu painel. (Conteúdo do dashboard aqui)
						</Text>
					</Stack>
				)}
				<div className={isOnboardingDone ? 'hidden' : ''}>
					<Onboarding profile={profile as any} />
				</div>
			</Stack>
		</Container>
	);
}
