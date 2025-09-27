'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { IStats } from '@/api/http/routes/analytics';
import { CardChart } from '@/components/charts/CardChart';
import { Badge } from '@/components/core/Badge';
import { Icon } from '@/components/core/Icon';
import { Stack } from '@/components/core/Stack';
import { Tabs } from '@/components/core/Tabs';
import { api } from '@/lib/orpc';

export default function Dashboard() {
	const [period, setPeriod] = useState<IStats>('7d');

	const { data: stats, isLoading: isStatsLoading } = useQuery(
		api.queries.analytics.stats.queryOptions({
			input: { period },
		}),
	);

	return (
		<Stack className="gap-5">
			<Badge>
				<Icon name="Dashboard" variant="bulk" size="20" />
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
						value={stats?.ranking.position ? `#${stats.ranking.position}` : '-'}
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
	);
}
