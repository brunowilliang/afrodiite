import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { api } from '@/lib/api';
import { tryCatch } from '@/utils/tryCatch';
import { Onboarding } from './-dashboard.profile/onboarding';
import { computeOnboardingCompletion } from './-dashboard.profile/schema';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { profile } = useLoaderData({ from: '/{-$locale}/(admin)/dashboard' });

	const completed = computeOnboardingCompletion((profile ?? {}) as any);
	const isOnboardingComplete = completed.every(Boolean);

	// Ref para evitar loops infinitos - guarda o último valor de is_visible que foi atualizado
	const lastVisibilityUpdate = useRef<boolean | null>(null);

	// Mutation para atualizar visibilidade do perfil
	const updateVisibility = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	// Effect para atualizar is_visible baseado na completude do perfil
	useEffect(() => {
		// Só executa se:
		// 1. Perfil existe
		// 2. Onboarding foi marcado como completo pelo menos uma vez
		// 3. O valor de is_visible precisa ser atualizado
		// 4. Não estamos em processo de atualização
		if (
			!profile?.id ||
			!profile?.is_onboarding_complete ||
			updateVisibility.isPending
		) {
			return;
		}

		const shouldBeVisible = isOnboardingComplete;
		const currentVisibility = profile.is_visible;

		// Só atualiza se:
		// 1. A visibilidade atual é diferente do que deveria ser
		// 2. Não é o mesmo valor que acabamos de atualizar (evita loop)
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
				await updateVisibility.mutateAsync({
					id: profile.id,
					is_visible: shouldBeVisible,
				});
			});
		}
	}, [
		profile?.id,
		profile?.is_onboarding_complete,
		profile?.is_visible,
		isOnboardingComplete,
		updateVisibility.isPending,
		updateVisibility.mutateAsync,
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
			</Stack>
		</Container>
	);
}
