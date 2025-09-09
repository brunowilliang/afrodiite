import { Alert } from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import type { ProfileSelect } from '@/api/utils/schemas/escort-forms';
import { Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { Button } from '@/components/heroui/Button';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';
import { cn } from '@/utils/cn';
import {
	computeOnboardingCompletion,
	getGalleryProgress,
	getServicesProgress,
} from './schema';

const steps = [
	{
		id: 1,
		title: 'Crie sua identidade ✨',
		description:
			'Seu nome, telefone, slug e data de nascimento são a base do seu perfil. Escolha detalhes que marquem presença e criem uma conexão instantânea com quem te encontra.',
		buttonText: 'Criar Identidade',
	},
	{
		id: 2,
		title: 'Marque seu território 📍',
		description:
			'Defina a cidade e a região onde você atua. Mostre onde seu brenho acontece e facilite que o público certo chegue até você com apenas um clique.',
		buttonText: 'Definir Localização',
	},
	{
		id: 3,
		title: 'Exiba seu diferencial 🌟',
		description:
			'Gênero, idade, altura, peso — cada detalhe conta uma história. Adicione características que destacam o que te torna único e fazem seu perfil vibrar.',
		buttonText: 'Adicionar Características',
	},
	{
		id: 4,
		title: 'Sincronize o desejo ⏰',
		description:
			'Horários claros mostram quando você está pronta para brilhar. Configure sua agenda para garantir encontros que fluem no ritmo certo, sem desencontros.',
		buttonText: 'Configurar Horários',
	},
	{
		id: 5,
		title: 'Estabeleça seu preço 💸',
		description:
			'Seja transparente com seus valores. Uma tabela de preços clara reflete confiança e deixa evidente que cada momento com você vale cada centavo.',
		buttonText: 'Definir Preços',
	},
	{
		id: 6,
		title: 'Acenda a expectativa 🔥',
		description:
			'Liste os serviços que você oferece com detalhes que despertam interesse. Mostre o que torna cada experiência única e deixe todos curiosos pelo próximo passo.',
		buttonText: 'Listar Serviços',
	},
	{
		id: 7,
		title: 'Roube a cena 📸',
		description:
			'Fotos são seu cartão de visita. Escolha imagens que param o scroll, provocam um segundo olhar e transformam curiosidade em decisão imediata.',
		buttonText: 'Fazer Upload de Fotos',
	},
] as const;

export type OnboardingProps = {
	profile: ProfileSelect | null | undefined;
	mode?: 'onboarding' | 'alerts'; // 'onboarding' = tela inicial, 'alerts' = apenas alertas de pendências
};

export const Onboarding = ({
	profile,
	mode = 'onboarding',
}: OnboardingProps) => {
	const navigate = useNavigate();

	// Mapeamento de step index para tab name
	const stepToTabMap = [
		'information', // 0
		'location', // 1
		'characteristics', // 2
		'schedule', // 3
		'prices', // 4
		'services', // 5
		'gallery', // 6
	] as const;

	const completedSteps = useMemo(
		() => computeOnboardingCompletion((profile ?? {}) as any),
		[profile],
	);
	const { stepsState } = useOnboardingStep(steps.length, completedSteps);

	// Calcular progresso dos serviços para mostrar aviso
	const servicesProgress = useMemo(
		() => getServicesProgress((profile ?? {}) as any),
		[profile],
	);

	// Calcular progresso da galeria para mostrar aviso
	const galleryProgress = useMemo(
		() => getGalleryProgress((profile ?? {}) as any),
		[profile],
	);

	// Função para obter a descrição dinâmica dos steps com progresso parcial
	const getStepDescription = (stepIndex: number) => {
		const step = steps[stepIndex];

		// Step 5 é o índice 5 (serviços)
		if (stepIndex === 5 && servicesProgress.hasPartialProgress) {
			return `${step.description}\n\n⚠️ Você selecionou ${servicesProgress.count} serviço${servicesProgress.count > 1 ? 's' : ''}, mas precisamos de pelo menos 6 para completar esta etapa.`;
		}

		// Step 6 é o índice 6 (galeria)
		if (stepIndex === 6 && galleryProgress.hasPartialProgress) {
			return `${step.description}\n\n⚠️ Você adicionou ${galleryProgress.count} foto${galleryProgress.count > 1 ? 's' : ''}, mas precisamos de pelo menos 5 para completar esta etapa.`;
		}

		return step.description;
	};

	// Renderizar conteúdo baseado no modo
	const onboardingContent =
		mode === 'alerts' ? (
			<Stack className="gap-5">
				<Stack className="gap-1">
					<Text size="xl" weight="bold">
						Seu perfil precisa de atenção ⚠️
					</Text>
					<Text size="md" weight="light">
						Algumas informações estão incompletas. Complete os itens abaixo para
						reativar seu perfil.
					</Text>
				</Stack>

				<Alert
					color="warning"
					title="🔒 Perfil Temporariamente Oculto"
					description="Seu perfil foi automaticamente ocultado porque algumas informações essenciais estão faltando. Complete os itens pendentes para reativá-lo."
					variant="faded"
					className="border-warning-300 bg-warning-50"
				/>

				{/* Lista apenas os steps incompletos */}
				{steps.map((step, idx) => {
					if (completedSteps[idx]) return null; // Só mostra os incompletos

					const description = getStepDescription(idx);
					const hasServicesWarning =
						idx === 5 && servicesProgress.hasPartialProgress;
					const hasGalleryWarning =
						idx === 6 && galleryProgress.hasPartialProgress;
					const hasWarning = hasServicesWarning || hasGalleryWarning;

					return (
						<Alert
							key={step.id}
							color="warning"
							title={step.title}
							description={description}
							variant="faded"
							className="border-warning-300 bg-warning-50"
							classNames={{
								base: 'flex flex-col gap-2 text-center md:text-left md:flex-row',
								description: cn(
									'font-light text-sm',
									hasWarning && 'whitespace-pre-line',
								),
								title: 'text-lg font-medium',
							}}
							endContent={
								<Button
									color="warning"
									size="sm"
									variant="flat"
									className="px-10"
									onPress={() => {
										navigate({
											to: '/{-$locale}/dashboard/profile',
											search: { tab: stepToTabMap[idx] },
										});
									}}
								>
									{hasServicesWarning
										? 'Completar Serviços'
										: hasGalleryWarning
											? 'Adicionar Mais Fotos'
											: 'Completar'}
								</Button>
							}
						/>
					);
				})}
			</Stack>
		) : (
			<Stack className="gap-5">
				<Stack className="gap-1">
					<Text size="xl" weight="bold">
						Prepare o seu perfil para destacar 🚀
					</Text>
					<Text size="md" weight="light">
						Em poucos passos, construa um perfil que para o scroll, atrai
						olhares e transforma interesse em ação instantânea.
					</Text>
				</Stack>

				{steps.map((step, idx) => {
					const s = stepsState[idx];
					const description = getStepDescription(idx);
					const hasServicesWarning =
						idx === 5 && servicesProgress.hasPartialProgress;
					const hasGalleryWarning =
						idx === 6 && galleryProgress.hasPartialProgress;
					const hasWarning = hasServicesWarning || hasGalleryWarning;
					const displayColor = hasWarning ? 'warning' : s.color;

					return (
						<Alert
							key={step.id}
							color={displayColor as any}
							title={step.title}
							description={description}
							variant="faded"
							className={cn(
								'flex',
								s.isCompleted || s.isActive || hasWarning
									? 'opacity-100'
									: 'opacity-35',
								hasWarning && 'border-warning-300 bg-warning-50',
							)}
							classNames={{
								base: 'flex flex-col gap-2 text-center md:text-left md:flex-row',
								description: cn(
									'font-light text-sm',
									hasWarning && 'whitespace-pre-line',
								),
								title: 'text-lg font-medium',
							}}
							endContent={
								<Button
									color={displayColor as any}
									size="sm"
									variant="flat"
									className="px-10"
									disabled={!s.isActive && !s.isCompleted && !hasWarning}
									onPress={() => {
										if (s.isActive || s.isCompleted || hasWarning) {
											navigate({
												to: '/{-$locale}/dashboard/profile',
												search: { tab: stepToTabMap[idx] },
											});
										}
									}}
								>
									{s.isCompleted
										? 'Editar'
										: hasServicesWarning
											? 'Completar Serviços'
											: hasGalleryWarning
												? 'Adicionar Mais Fotos'
												: step.buttonText}
								</Button>
							}
						/>
					);
				})}
			</Stack>
		);

	return onboardingContent;
};
