import { createFileRoute } from '@tanstack/react-router';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { EscortCard } from '@/components/escorts/Card';
import { NestedMenu } from '@/components/escorts/NestedMenu';
import { Onboarding } from './-dashboard.profile/onboarding';
import { computeOnboardingCompletion } from './-dashboard.profile/schema';

//  1. Visitas no perfil
// Mostra o número de visitantes únicos no perfil em um período (ex: últimos 7 dias).
//  2. Cliques em WhatsApp
// Quantas vezes clientes clicaram para abrir o WhatsApp da modelo.
//  3. Cliques em Ligar
// Quantas vezes clientes clicaram para ligar para a modelo.
//  4. Taxa de conversão
// Porcentagem de visitantes que realmente entraram em contato (WhatsApp ou ligação).
//  5. Perfil mais visitado
// Se a modelo tem mais de um anúncio, mostra qual perfil/serviço está recebendo mais visitas.
//  6. Avaliações recebidas
// Número de avaliações ou comentários recebidos recentemente.

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

				<Stack className="gap-1">
					<Text size="xl" weight="bold">
						Dashboard
					</Text>
					<Text size="md" weight="light">
						Bem-vinda ao seu painel. (Conteúdo do dashboard aqui)
					</Text>
				</Stack>

				<NestedMenu />

				<Stack className="grid grid-cols-2 gap-4 md:grid-cols-3">
					<EscortCard profile={profile as any} />
					<EscortCard profile={profile as any} />
				</Stack>

				<div className={isOnboardingDone ? 'hidden' : ''}>
					<Onboarding profile={profile as any} />
				</div>
			</Stack>
		</Container>
	);
}
