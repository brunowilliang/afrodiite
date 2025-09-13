import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createFileRoute,
	useLoaderData,
	useRouter,
} from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { IStats } from '@/api/http/routes/analytics';
import { CardChart } from '@/components/charts/CardChart';
import { Icon } from '@/components/core/Icon';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { Badge } from '@/components/heroui/Badge';
import { Tabs } from '@/components/heroui/Tabs';
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
	// const visibilityRef = useRef(profile?.is_visible ?? false);

	const [period, setPeriod] = useState<IStats>('7d');

	const { data: stats, isLoading: isStatsLoading } = useQuery(
		api.queries.analytics.stats.queryOptions({
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
		<Stack>
			<Stack className="gap-10">
				{!isOnboardingComplete && (
					<Onboarding profile={profile as any} mode="alerts" />
				)}
			</Stack>
			<Stack className="gap-5">
				{/* header */}
				<Stack direction="column" className="justify-between gap-5">
					<Badge>
						<Icon name="Stars" variant="bulk" size="20" />
						Dashboard
					</Badge>

					<Tabs
						aria-label="Filter Stats"
						selectedKey={period}
						onSelectionChange={(key) => {
							setPeriod(key as IStats);
						}}
					>
						<Tabs.Tab key="7d" title="7 dias" />
						<Tabs.Tab key="30d" title="30 dias" />
						<Tabs.Tab key="90d" title="90 dias" />
					</Tabs>
				</Stack>

				<Stack className="gap-4">
					<Stack className="grid grid-cols-3 gap-4">
						<CardChart
							title="Visitas no perfil"
							value={stats?.summary.views || 0}
							isLoading={isStatsLoading}
							modalTitle="Visualizações"
							modalText="Visualizações"
						/>
						<CardChart
							title="Cliques no WhatsApp"
							value={stats?.summary.whatsapp_clicks || 0}
							isLoading={isStatsLoading}
							modalTitle="Cliques WhatsApp"
							modalText="Cliques WhatsApp"
						/>
						<CardChart
							title="Cliques no Telefone"
							value={stats?.summary.phone_clicks || 0}
							isLoading={isStatsLoading}
							modalTitle="Cliques Telefone"
							modalText="Cliques Telefone"
						/>
					</Stack>
					<Stack className="grid grid-cols-2 gap-4">
						<CardChart
							title="Ranking Geral"
							value={
								stats?.ranking.position ? `#${stats.ranking.position}` : '-'
							}
							isLoading={isStatsLoading}
							modalTitle="Posição no Ranking"
							modalText={
								stats?.ranking.is_top_30
									? 'Você está no Top 30! 🏆'
									: `Você está na posição #${stats?.ranking.position}`
							}
						/>
						<CardChart
							title="Taxa de conversão"
							value={
								stats?.summary.conversion_rate
									? `${stats.summary.conversion_rate}%`
									: '0%'
							}
							isLoading={isStatsLoading}
							modalTitle="Taxa Conversão"
							modalText="Taxa Conversão"
						/>
						<CardChart
							title="Melhor Horário"
							value={stats?.performance.insights.peak_hours[0]?.hour || '-'}
							isLoading={isStatsLoading}
							modalTitle="Horários de Pico"
							modalText={`Top 3: ${stats?.performance.insights.peak_hours.map((h) => h.hour).join(', ') || 'Sem dados'}`}
						/>
						<CardChart
							title="Melhor Dia"
							value={stats?.performance.insights.best_days[0]?.day || '-'}
							isLoading={isStatsLoading}
							modalTitle="Dias com Mais Atividade"
							modalText={`Top 3: ${stats?.performance.insights.best_days.map((d) => d.day).join(', ') || 'Sem dados'}`}
						/>
						<CardChart
							title="Acessos Mobile"
							value={`${stats?.devices.mobile.percentage || '0'}%`}
							isLoading={isStatsLoading}
							modalTitle="Dispositivos Móveis"
							modalText={`${stats?.devices.mobile.count || 0} acessos via mobile (${stats?.devices.mobile.percentage || 0}%)`}
						/>
						<CardChart
							title="Acessos Desktop"
							value={`${stats?.devices.desktop.percentage || '0'}%`}
							isLoading={isStatsLoading}
							modalTitle="Dispositivos Desktop"
							modalText={`${stats?.devices.desktop.count || 0} acessos via desktop (${stats?.devices.desktop.percentage || 0}%)`}
						/>
					</Stack>
				</Stack>
			</Stack>

			{/* Seção de Performance Detalhada */}
			{/* {stats?.performance && (
				<Stack className="gap-6">
					<Text size="xl" weight="bold">
						Performance Detalhada
					</Text>

					<Stack className="gap-4">
						<Text size="lg" weight="bold">
							🕐 Melhores Horários
						</Text>
						<Stack className="grid grid-cols-5 gap-2">
							{stats.performance.hourly
								.filter((h) => h.views > 0 || h.clicks > 0)
								.sort((a, b) => b.views + b.clicks - (a.views + a.clicks))
								.slice(0, 5)
								.map((hour) => (
									<CardChart
										key={hour.hour}
										title={hour.hour_label}
										value={hour.views + hour.clicks}
										isLoading={isStatsLoading}
										modalTitle={`Atividade às ${hour.hour_label}`}
										modalText={`Views: ${hour.views} | Clicks: ${hour.clicks} | Conversão: ${hour.conversion}%`}
									/>
								))}
						</Stack>
					</Stack>

					<Stack className="gap-4">
						<Text size="lg" weight="bold">
							📅 Performance por Dia
						</Text>
						<Stack className="grid grid-cols-7 gap-2">
							{stats.performance.daily.map((day) => (
								<CardChart
									key={day.day_index}
									title={day.day_name.slice(0, 3)}
									value={day.views + day.clicks}
									isLoading={isStatsLoading}
									modalTitle={`${day.day_name}`}
									modalText={`Views: ${day.views} | Clicks: ${day.clicks} | Conversão: ${day.conversion}%`}
								/>
							))}
						</Stack>
					</Stack>
				</Stack>
			)} */}
		</Stack>
	);
}
