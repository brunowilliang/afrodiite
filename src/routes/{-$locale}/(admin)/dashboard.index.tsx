import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createFileRoute,
	useLoaderData,
	useRouter,
} from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { CardChart } from '@/components/charts/CardChart';
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

	const lastOnboardingUpdate = useRef<boolean | null>(null);
	const visibilityRef = useRef(profile?.is_visible ?? false);

	const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

	const { data: analytics, isLoading: isAnalyticsLoading } = useQuery(
		api.queries.analytics.dashboard.queryOptions({
			input: { period },
		}),
	);

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions({
			onSuccess: () => {
				router.invalidate();
			},
			onError: (error) => console.error(error),
		}),
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

	// ✅ Removido: Effect automático que conflitava com switch manual
	// useEffect(() => {
	// 	if (
	// 		!profile?.id ||
	// 		!profile?.is_onboarding_complete ||
	// 		updateProfile.isPending
	// 	) {
	// 		return;
	// 	}

	// 	const shouldBeVisible = isOnboardingComplete;
	// 	const currentVisibility = profile.is_visible;

	// 	if (
	// 		currentVisibility !== shouldBeVisible &&
	// 		lastVisibilityUpdate.current !== shouldBeVisible
	// 	) {
	// 		console.log('Updating profile visibility:', {
	// 			from: currentVisibility,
	// 			to: shouldBeVisible,
	// 			isOnboardingComplete,
	// 		});

	// 		lastVisibilityUpdate.current = shouldBeVisible;

	// 		// Usar tryCatch para atualizar a visibilidade
	// 		tryCatch(async () => {
	// 			await updateProfile.mutateAsync({
	// 				id: profile.id,
	// 				is_visible: shouldBeVisible,
	// 			});

	// 			// Invalidar o cache e recarregar a rota
	// 			await queryClient.invalidateQueries();
	// 			router.invalidate();
	// 		});
	// 	}
	// }, [
	// 	profile?.id,
	// 	profile?.is_onboarding_complete,
	// 	profile?.is_visible,
	// 	isOnboardingComplete,
	// 	updateProfile.isPending,
	// 	updateProfile.mutateAsync,
	// 	queryClient,
	// 	router,
	// ]);

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
			<Stack direction="row" className="items-center justify-between gap-4">
				<Text size="2xl" weight="bold">
					Olá, {profile?.name} 👋
				</Text>

				<Stack direction="row" className="w-1/2 items-center gap-4">
					<Input.Select
						label="Selecione o período"
						aria-label="Selecionar período de analytics"
						size="sm"
						isClearable={false}
						value={period}
						selectedKeys={[period]}
						onChange={(e) => {
							setPeriod(e.target.value as '7d' | '30d' | '90d');
						}}
					>
						<Input.Select.Item key="7d">7 dias</Input.Select.Item>
						<Input.Select.Item key="30d">30 dias</Input.Select.Item>
						<Input.Select.Item key="90d">90 dias</Input.Select.Item>
					</Input.Select>

					<Input.Switch
						className="w-full"
						isSelected={visibilityRef.current}
						onValueChange={(isVisible) => {
							visibilityRef.current = isVisible;
							updateProfile.mutate({
								is_visible: isVisible,
							});
						}}
					>
						Perfil Ativo
					</Input.Switch>
				</Stack>
			</Stack>
			<Stack className="grid grid-cols-4 gap-4">
				<CardChart
					title="Visitas no perfil"
					value={analytics?.summary.views || 0}
					isLoading={isAnalyticsLoading}
					modalTitle="Visualizações"
					modalText="Visualizações"
				/>
				<CardChart
					title="Cliques no WhatsApp"
					value={analytics?.summary.whatsapp_clicks || 0}
					isLoading={isAnalyticsLoading}
					modalTitle="Cliques WhatsApp"
					modalText="Cliques WhatsApp"
				/>
				<CardChart
					title="Cliques no Telefone"
					value={analytics?.summary.phone_clicks || 0}
					isLoading={isAnalyticsLoading}
					modalTitle="Cliques Telefone"
					modalText="Cliques Telefone"
				/>
				<CardChart
					title="Taxa de conversão"
					value={analytics?.summary.conversion_rate || '0'}
					isLoading={isAnalyticsLoading}
					modalTitle="Taxa Conversão"
					modalText="Taxa Conversão"
				/>
			</Stack>
		</Container>
	);
}
