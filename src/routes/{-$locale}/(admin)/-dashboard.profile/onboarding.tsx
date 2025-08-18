import { Alert } from '@heroui/react';
import { useMemo, useRef, useState } from 'react';
import type { ProfileSelect } from '@/api/utils/types/escort';
import { Icon } from '@/components/core/Icon';
import { Stack } from '@/components/core/Stack';
import { Badge } from '@/components/heroui/Badge';
import { Button } from '@/components/heroui/Button';
import { Modal, ModalRef } from '@/components/heroui/Modal';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';
import { cn } from '@/utils/cn';
import { CharacteristicsTab } from './Characteristics';
import { GalleryTab } from './Gallery';
import { InformationTab } from './Information';
import { LocationTab } from './Location';
import { OfficeHoursTab } from './OfficeHours';
import { PricesTab } from './Prices';
import { ServicesTab } from './Services';
import { computeOnboardingCompletion } from './schema';

const steps = [
	{
		id: 1,
		title: 'Crie sua identidade ✨',
		description:
			'Seu nome, telefone, slug e data de nascimento são a base do seu perfil. Escolha detalhes que marquem presença e criem uma conexão instantânea com quem te encontra.',
		buttonText: 'Criar Identidade',
		buttonLink: '/{-$locale}/dashboard/profile?',
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
] as const;

export type OnboardingProps = {
	profile: ProfileSelect | null | undefined;
};

export const Onboarding = ({ profile }: OnboardingProps) => {
	const modalRef = useRef<ModalRef>(null);
	const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

	const completedSteps = useMemo(
		() => computeOnboardingCompletion((profile ?? {}) as any),
		[profile],
	);
	const { stepsState } = useOnboardingStep(steps.length, completedSteps);

	const closeModal = () => {
		modalRef.current?.close();
		setSelectedIdx(null);
	};

	const renderSelectedTab = () => {
		if (selectedIdx === null) return null;
		switch (selectedIdx) {
			case 0:
				return <InformationTab onClose={closeModal} />;
			case 1:
				return <LocationTab onClose={closeModal} />;
			case 2:
				return <CharacteristicsTab onClose={closeModal} />;
			case 3:
				return <OfficeHoursTab onClose={closeModal} />;
			case 4:
				return <PricesTab onClose={closeModal} />;
			case 5:
				return <ServicesTab />;
			case 6:
				return <GalleryTab />;
			default:
				return null;
		}
	};

	return (
		<>
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
							className={cn(
								'flex bg-red-500',
								s.isCompleted || s.isActive ? 'opacity-100' : 'opacity-35',
							)}
							classNames={{
								base: 'flex flex-col gap-2 text-center md:text-left md:flex-row',
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
											setSelectedIdx(idx);
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
			<Modal
				ref={modalRef}
				title={selectedIdx !== null ? steps[selectedIdx].title : 'Onboarding'}
				placement="top-center"
				size="3xl"
				scrollBehavior="outside"
			>
				<Modal.Content>
					<Modal.Body className="px-5 py-6">
						<Stack className="gap-5">
							<Badge>
								<Icon name="Stars" variant="bulk" size="20" />
								{selectedIdx !== null ? steps[selectedIdx].title : ''}
							</Badge>
							{renderSelectedTab()}
						</Stack>
					</Modal.Body>
				</Modal.Content>
			</Modal>
		</>
	);
};
