import { Alert } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useRef } from 'react';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { Button } from '@/components/heroui/Button';
import { Modal, ModalRef } from '@/components/heroui/Modal';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';
import { computeOnboardingCompletion } from './-dashboard.profile/schema';

const steps = [
	{
		id: 1,
		title: 'Crie sua identidade ✨',
		description:
			'Seu nome, telefone, slug e data de nascimento são a base do seu perfil. Escolha detalhes que marquem presença e criem uma conexão instantânea com quem te encontra.',
		buttonText: 'Criar Identidade',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
	{
		id: 2,
		title: 'Marque seu território 📍',
		description:
			'Defina a cidade e a região onde você atua. Mostre onde seu brenho acontece e facilite que o público certo chegue até você com apenas um clique.',
		buttonText: 'Definir Localização',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
	{
		id: 3,
		title: 'Exiba seu diferencial 🌟',
		description:
			'Gênero, idade, altura, peso — cada detalhe conta uma história. Adicione características que destacam o que te torna único e fazem seu perfil vibrar.',
		buttonText: 'Adicionar Características',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
	{
		id: 4,
		title: 'Sincronize o desejo ⏰',
		description:
			'Horários claros mostram quando você está pronta para brilhar. Configure sua agenda para garantir encontros que fluem no ritmo certo, sem desencontros.',
		buttonText: 'Configurar Horários',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
	{
		id: 5,
		title: 'Estabeleça seu preço 💸',
		description:
			'Seja transparente com seus valores. Uma tabela de preços clara reflete confiança e deixa evidente que cada momento com você vale cada centavo.',
		buttonText: 'Definir Preços',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
	{
		id: 6,
		title: 'Acenda a expectativa 🔥',
		description:
			'Liste os serviços que você oferece com detalhes que despertam interesse. Mostre o que torna cada experiência única e deixe todos curiosos pelo próximo passo.',
		buttonText: 'Listar Serviços',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
	{
		id: 7,
		title: 'Roube a cena 📸',
		description:
			'Fotos são seu cartão de visita. Escolha imagens que param o scroll, provocam um segundo olhar e transformam curiosidade em decisão imediata.',
		buttonText: 'Fazer Upload de Fotos',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
];
export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/')({
	component: RouteComponent,
});
function RouteComponent() {
	const { profile } = Route.useRouteContext();
	const modalRef = useRef<ModalRef>(null);

	const completedSteps = useMemo(() => computeOnboardingCompletion(profile as any), [profile]);
	const { stepsState } = useOnboardingStep(steps.length, completedSteps);

	return (
		<Container>
			<Stack className="gap-10">
				<Text size="2xl" weight="bold">
					Olá, {profile?.name} 👋
				</Text>
				<Stack className="gap-1">
					<Text size="xl" weight="bold">
						Prepare o seu perfil para destacar 🚀
					</Text>
					<Text size="md" weight="light">
						Em poucos passos, construa um perfil que para o scroll, atrai
						olhares e transforma interesse em ação instantânea.
					</Text>
				</Stack>
				<Stack className="gap-5">
					{steps.map((step, idx) => {
						const s = stepsState[idx];
						return (
							<Alert
								key={step.id}
								color={s.color}
								title={step.title}
								description={step.description}
								variant="faded"
								className={s.isCompleted || s.isActive ? 'opacity-100' : 'opacity-35'}
								classNames={{
									description: 'text-sm font-light',
									title: 'text-lg font-medium',
								}}
								endContent={
									<Button
										color={s.color}
										size="sm"
										variant="flat"
										className="px-10"
										disabled={!s.isActive}
										onPress={() => {
											if (s.isActive) {
												modalRef.current?.open();
											}
										}}
									>
										{step.buttonText}
									</Button>
								}
							/>
						);
					})}
				</Stack>
			</Stack>
			<Modal
				ref={modalRef}
				title="Criar Identidade"
				placement="bottom"
				size="full"
				scrollBehavior="inside"
			>
				<Modal.Content>
					<Modal.Body>
						<Stack className="gap-5">
							<Text size="xl" weight="bold">
								Criar Identidade
							</Text>
							<Text size="md" weight="light">
								Crie sua identidade para começar a usar o sistema.
							</Text>
						</Stack>
					</Modal.Body>
				</Modal.Content>
			</Modal>
		</Container>
	);
}
