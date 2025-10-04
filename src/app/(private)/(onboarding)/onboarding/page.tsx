'use client';
import { useRouter } from 'next/navigation';
import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { Modal } from '@/components/core/Modal';
import { Stack } from '@/components/core/Stack';
import { useProfile } from '@/hooks/useProfile';
import { Alert } from './componentes/Alert';
import { getOnboardingStatus } from './componentes/schema';
import { steps } from './componentes/steps';

export default function Onboarding() {
	const router = useRouter();
	const { profile, updateProfile, isUpdating } = useProfile();

	const status = getOnboardingStatus(profile as IProfile.Select);

	// Check if all steps are complete
	const allStepsComplete = steps.every(
		(step) => status[step.key as keyof typeof status].isComplete,
	);

	const handleCompleteOnboarding = async () => {
		await updateProfile(
			{ is_onboarding_complete: true, is_visible: true },
			{
				toastTitle: 'Perfil Ativado com sucesso! 🎉',
			},
		);
	};

	return (
		<Stack className="gap-5 py-10">
			<Stack className="centered gap-3 py-10 text-center">
				<Badge color="primary" variant="flat" size="md" radius="md">
					Onboarding
				</Badge>
				<h1 className="mt-2 font-semibold text-3xl text-default-700">
					Complete seu perfil
				</h1>
				<p className="text-default-600">
					Complete todas as etapas para ativar seu perfil e começar a receber
					visualizações!
				</p>
			</Stack>

			{steps.map((step, index) => {
				const stepStatus = status[step.key as keyof typeof status];

				// Check if all previous steps are complete
				const previousStepsComplete =
					index === 0 ||
					steps
						.slice(0, index)
						.every(
							(prevStep) =>
								status[prevStep.key as keyof typeof status].isComplete,
						);

				const mode = stepStatus.isComplete
					? 'success'
					: stepStatus.hasPartialProgress
						? 'warning'
						: 'primary';

				const buttonText = stepStatus.isComplete ? 'Editar' : step.button;

				// Customize description for partial progress (servicos/galeria)
				let description: React.ReactNode = step.description;
				if (stepStatus.hasPartialProgress && 'count' in stepStatus) {
					const { count } = stepStatus;
					const minRequired = step.key === 'servicos' ? 5 : 5;
					const itemType = step.key === 'servicos' ? 'serviço' : 'foto';
					const plural = count !== 1 ? 's' : '';

					description = (
						<>
							{step.description}
							<br />
							<br />
							<span className="text-warning">
								⚠️ Você {step.key === 'servicos' ? 'selecionou' : 'adicionou'}{' '}
								{count} {itemType}
								{plural}, mas precisamos de pelo menos {minRequired} para
								completar esta etapa.
							</span>
						</>
					);
				}

				return (
					<Alert
						key={step.key}
						mode={mode}
						title={step.title}
						description={description}
						buttonTitle={buttonText}
						disabled={!previousStepsComplete}
						onPress={() => {
							router.push(step.link as any);
						}}
					/>
				);
			})}

			{allStepsComplete && (
				<Modal
					isOpen={true}
					hideCloseButton
					placement="center"
					shouldBlockScroll={true}
				>
					<Modal.Content className="centered bg-default-100/50 py-7">
						<Modal.Header className="flex-col items-center gap-2 px-6 pt-5 pb-3 text-default-700">
							<p className="text-5xl">✨🎉</p>Perfil completado com sucesso!
						</Modal.Header>
						<Modal.Body className="px-6 pt-3 pb-5 text-center">
							Você completou todas as etapas do onboarding.
							<br />
							Agora é só ativar seu perfil para começar a receber visualizações!
						</Modal.Body>
						<Modal.Footer className="px-6 pt-3 pb-5 text-center">
							<Button
								color="success"
								size="md"
								variant="flat"
								className="px-7"
								onPress={handleCompleteOnboarding}
								isLoading={isUpdating}
							>
								Ativar Perfil
							</Button>
						</Modal.Footer>
					</Modal.Content>
				</Modal>
			)}
		</Stack>
	);
}
