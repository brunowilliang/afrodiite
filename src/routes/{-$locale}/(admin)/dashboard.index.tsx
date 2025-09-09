import { Card } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	createFileRoute,
	useLoaderData,
	useRouter,
} from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { Input } from '@/components/heroui/Input';
import { api } from '@/lib/api';
import { tryCatch } from '@/utils/tryCatch';
import { Onboarding } from './-dashboard.profile/onboarding';
import { computeOnboardingCompletion } from './-dashboard.profile/schema';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { profile } = useLoaderData({ from: '/{-$locale}/(admin)/dashboard' });
	const queryClient = useQueryClient();
	const router = useRouter();

	const completed = computeOnboardingCompletion((profile ?? {}) as any);
	const isOnboardingComplete = completed.every(Boolean);

	const lastVisibilityUpdate = useRef<boolean | null>(null);
	const lastOnboardingUpdate = useRef<boolean | null>(null);

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	// Effect para atualizar is_onboarding_complete quando o onboarding é completado
	useEffect(() => {
		if (
			!profile?.id ||
			updateProfile.isPending ||
			profile?.is_onboarding_complete // Se já está marcado como completo, não precisa atualizar
		) {
			return;
		}

		// Se o onboarding foi completado mas ainda não foi marcado na API
		if (
			isOnboardingComplete &&
			lastOnboardingUpdate.current !== isOnboardingComplete
		) {
			console.log('Updating onboarding completion status:', {
				isOnboardingComplete,
				currentStatus: profile.is_onboarding_complete,
			});

			lastOnboardingUpdate.current = isOnboardingComplete;

			// Atualizar is_onboarding_complete na API
			tryCatch(async () => {
				await updateProfile.mutateAsync({
					id: profile.id,
					is_onboarding_complete: true,
				});

				// Invalidar o cache e recarregar a rota
				await queryClient.invalidateQueries();
				router.invalidate();
			});
		}
	}, [
		profile?.id,
		profile?.is_onboarding_complete,
		isOnboardingComplete,
		updateProfile.isPending,
		updateProfile.mutateAsync,
		queryClient,
		router,
	]);

	// Effect para atualizar visibilidade quando necessário
	useEffect(() => {
		if (
			!profile?.id ||
			!profile?.is_onboarding_complete ||
			updateProfile.isPending
		) {
			return;
		}

		const shouldBeVisible = isOnboardingComplete;
		const currentVisibility = profile.is_visible;

		if (
			currentVisibility !== shouldBeVisible &&
			lastVisibilityUpdate.current !== shouldBeVisible
		) {
			console.log('Updating profile visibility:', {
				from: currentVisibility,
				to: shouldBeVisible,
				isOnboardingComplete,
			});

			lastVisibilityUpdate.current = shouldBeVisible;

			// Usar tryCatch para atualizar a visibilidade
			tryCatch(async () => {
				await updateProfile.mutateAsync({
					id: profile.id,
					is_visible: shouldBeVisible,
				});

				// Invalidar o cache e recarregar a rota
				await queryClient.invalidateQueries();
				router.invalidate();
			});
		}
	}, [
		profile?.id,
		profile?.is_onboarding_complete,
		profile?.is_visible,
		isOnboardingComplete,
		updateProfile.isPending,
		updateProfile.mutateAsync,
		queryClient,
		router,
	]);

	// Lógica condicional principal
	if (!profile?.is_onboarding_complete) {
		// Mostrar onboarding se ainda não foi completado
		return (
			<Container>
				<Stack className="gap-10">
					<Text size="2xl" weight="bold">
						Olá, {profile?.name} 👋
					</Text>
					<Onboarding profile={profile as any} />
				</Stack>
			</Container>
		);
	}

	// Se onboarding foi completado, mostrar dashboard
	return (
		<Container>
			<Stack className="gap-10">
				{!isOnboardingComplete && (
					<Onboarding profile={profile as any} mode="alerts" />
				)}
			</Stack>
			<Stack direction="row" className="justify-between gap-4">
				<Text size="2xl" weight="bold">
					Olá, {profile?.name} 👋
				</Text>
				<Text size="2xl" weight="bold">
					<Input.Switch
						checked={profile?.is_visible ?? false}
						defaultChecked={profile?.is_visible}
						onChange={() =>
							updateProfile.mutate({
								id: profile?.id,
								is_visible: !profile?.is_visible,
							})
						}
					>
						Pefil Ativo
					</Input.Switch>
				</Text>
			</Stack>
			<Stack className="grid grid-cols-4 gap-4">
				<Card className="p-4">
					<Text>Visitações</Text>
					<Text>100</Text>
				</Card>
				<Card className="p-4">
					<Text>Visitações</Text>
					<Text>100</Text>
				</Card>
				<Card className="p-4">
					<Text>Visitações</Text>
					<Text>100</Text>
				</Card>
				<Card className="p-4">
					<Text>Visitações</Text>
					<Text>100</Text>
				</Card>
			</Stack>
		</Container>
	);
}
