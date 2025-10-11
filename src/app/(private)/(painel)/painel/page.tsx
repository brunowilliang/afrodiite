'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { IAnalytics } from '@/api/http/routes/analytics';
import { CardChart } from '@/components/charts/CardChart';
import { Stack } from '@/components/core/Stack';
import { Tabs } from '@/components/core/Tabs';
import { api } from '@/lib/orpc';
import { Badge } from '../components/Badge';

const DAYS_PT: Record<string, string> = {
	sunday: 'Domingo',
	monday: 'Segunda-feira',
	tuesday: 'Terça-feira',
	wednesday: 'Quarta-feira',
	thursday: 'Quinta-feira',
	friday: 'Sexta-feira',
	saturday: 'Sábado',
};

export default function Dashboard() {
	const [period, setPeriod] = useState<IAnalytics.Period>('7daysAgo');

	const { data: stats, isLoading: isStatsLoading } = useQuery(
		api.queries.analytics.stats.queryOptions({
			input: { period },
		}),
	);

	return (
		<Stack className="gap-5">
			<Badge icon="Dashboard" label="Dashboard" />

			<Tabs
				aria-label="Filter Stats"
				selectedKey={period}
				onSelectionChange={(key) => {
					setPeriod(key as IAnalytics.Period);
				}}
			>
				<Tabs.Tab key="7daysAgo" title="7 Dias" />
				<Tabs.Tab key="14daysAgo" title="14 Dias" />
				<Tabs.Tab key="30daysAgo" title="30 Dias" />
				<Tabs.Tab key="60daysAgo" title="60 Dias" />
				<Tabs.Tab key="90daysAgo" title="90 Dias" />
			</Tabs>

			<Stack className="gap-4">
				<Stack className="grid grid-cols-2 gap-4 lg:grid-cols-3">
					<CardChart
						title="Visitas no perfil"
						value={stats?.profile_views || 0}
						isLoading={isStatsLoading}
						modalTitle="Visitas no perfil"
						modalText="Representa o número total de vezes que seu perfil foi visualizado no período selecionado. Cada acesso único à sua página conta como uma visita. Este dado é fundamental para entender o alcance e visibilidade do seu perfil na plataforma. Quanto maior esse número, maior é o interesse e exposição que você está gerando. Use essa métrica para avaliar a efetividade das suas fotos, descrição e posicionamento no site."
					/>
					<CardChart
						title="Cliques no WhatsApp"
						value={stats?.whatsapp_clicks || 0}
						isLoading={isStatsLoading}
						modalTitle="Cliques no WhatsApp"
						modalText="Indica quantas vezes usuários clicaram no botão de WhatsApp do seu perfil no período selecionado. Esse é um dos indicadores mais importantes, pois representa o interesse direto em entrar em contato com você. Um número alto demonstra que seu perfil está gerando conversões efetivas e atraindo clientes potenciais qualificados."
					/>
					<CardChart
						title="Cliques no Telefone"
						value={stats?.phone_clicks || 0}
						isLoading={isStatsLoading}
						modalTitle="Cliques no Telefone"
						modalText="Mostra quantas vezes usuários clicaram no botão de telefone do seu perfil no período selecionado. Assim como os cliques no WhatsApp, esse dado representa uma ação concreta de interesse em contato direto. Alguns clientes preferem ligar ao invés de enviar mensagem, por isso é importante monitorar ambas as formas de contato. Um volume equilibrado entre telefone e WhatsApp indica que você está oferecendo opções adequadas para diferentes perfis de clientes."
					/>
					<CardChart
						title="Ranking Geral"
						value={stats?.ranking ? `#${stats.ranking}` : '-'}
						isLoading={isStatsLoading}
						modalTitle="Ranking Geral"
						modalText="Mostra sua posição entre todas as acompanhantes da plataforma com base no número de visualizações de perfil no período selecionado. Quanto menor o número, melhor sua posição (ex: #1 significa que você é a mais visualizada). Essa métrica permite comparar seu desempenho com outras profissionais e identificar oportunidades de destaque. Se você não aparecer no ranking, significa que ainda não há dados suficientes no período selecionado."
					/>
					<CardChart
						title="Melhor Horário"
						value={stats?.best_hour || '-'}
						isLoading={isStatsLoading}
						modalTitle="Melhor Horário"
						modalText="Identifica o horário do dia (0-23h) em que seu perfil recebe mais visualizações no período selecionado. Essa informação ajuda você a entender em quais momentos os usuários estão mais ativos na plataforma. Use esse dado para planejar atualizações de perfil, promoções ou disponibilidade nos horários de maior movimento, maximizando suas chances de ser encontrada e contatada."
					/>
					<CardChart
						title="Melhor Dia"
						value={
							stats?.best_day ? DAYS_PT[stats.best_day] || stats.best_day : '-'
						}
						isLoading={isStatsLoading}
						modalTitle="Melhor Dia"
						modalText="Indica o dia da semana (0=domingo, 6=sábado) em que seu perfil recebe mais visualizações no período selecionado. Conhecer os dias de maior tráfego permite otimizar sua estratégia de atendimento e presença online. Você pode programar atualizações de fotos ou conteúdo nos dias de maior movimento para aproveitar o pico de visitantes e aumentar suas chances de conversão."
					/>
				</Stack>
				<Stack className="grid grid-cols-2 gap-4 lg:grid-cols-3">
					<CardChart
						title="Taxa de conversão (WhatsApp)"
						value={stats?.whatsapp_conversion || '0%'}
						isLoading={isStatsLoading}
						modalTitle="Taxa de conversão"
						modalText="Percentual de visitantes que clicaram no WhatsApp após visualizar seu perfil no período selecionado. Calculado dividindo os cliques no WhatsApp pelo total de visualizações. Uma taxa de conversão alta (acima de 20%) indica que seu perfil é atrativo e está convencendo visitantes a entrarem em contato. Se a taxa estiver baixa, considere melhorar suas fotos, descrição ou preços para aumentar o interesse dos visitantes."
					/>
					<CardChart
						title="Taxa de conversão (Telefone)"
						value={stats?.phone_conversion || '0%'}
						isLoading={isStatsLoading}
						modalTitle="Taxa de conversão (Telefone)"
						modalText="Percentual de visitantes que clicaram no telefone após visualizar seu perfil no período selecionado. Calculado dividindo os cliques no telefone pelo total de visualizações. Alguns clientes preferem ligar diretamente ao invés de enviar mensagem pelo WhatsApp. Compare essa taxa com a conversão do WhatsApp para entender qual canal de contato seu público prefere e priorize o destaque do método mais utilizado no seu perfil."
					/>
					<CardChart
						title="Acessos Mobile"
						value={`${stats?.mobile_access || '0'}`}
						isLoading={isStatsLoading}
						modalTitle="Acessos Mobile"
						modalText="Mostra a quantidade de acessos ao seu perfil vindos de dispositivos móveis (smartphones e tablets) no período selecionado. A maioria dos usuários acessa pelo celular, então é essencial que suas fotos e informações sejam otimizadas para telas menores. Um número alto de acessos mobile confirma a importância de manter conteúdo visual de qualidade e de carregamento rápido."
					/>
					<CardChart
						title="Acessos Desktop"
						value={`${stats?.desktop_access || '0'}`}
						isLoading={isStatsLoading}
						modalTitle="Acessos Desktop"
						modalText="Mostra a quantidade de acessos ao seu perfil vindos de computadores (desktop e notebook) no período selecionado. Usuários de desktop tendem a passar mais tempo navegando e analisando perfis antes de decidir contatar. Compare esse dado com os acessos mobile para entender o comportamento da sua audiência e garantir que seu perfil oferece uma boa experiência em ambas as plataformas."
					/>
					<CardChart
						title="Acessos Mobile (%)"
						value={`${stats?.mobile_percentage || '0'}%`}
						isLoading={isStatsLoading}
						modalTitle="Acessos Mobile (Porcentagem)"
						modalText="Mostra o percentual de acessos ao seu perfil vindos de dispositivos móveis em relação ao total de visualizações. No mercado digital atual, a maioria dos usuários acessa serviços pelo celular. Um percentual alto (acima de 70%) confirma essa tendência e reforça a necessidade de ter fotos verticais de qualidade, descrição concisa e botões de contato bem visíveis para telas menores. Se esse percentual for baixo, pode indicar uma oportunidade de melhorar a experiência mobile do seu perfil."
					/>
					<CardChart
						title="Acessos Desktop (%)"
						value={`${stats?.desktop_percentage || '0'}%`}
						isLoading={isStatsLoading}
						modalTitle="Acessos Desktop (Porcentagem)"
						modalText="Mostra o percentual de acessos ao seu perfil vindos de computadores em relação ao total de visualizações. Usuários de desktop costumam ter sessões mais longas, analisando detalhes, comparando perfis e lendo descrições completas antes de tomar a decisão de contato. Um percentual significativo (acima de 30%) indica que vale investir em fotos horizontais de alta qualidade e textos mais detalhados. A soma dos percentuais mobile e desktop sempre totaliza 100%."
					/>
				</Stack>
			</Stack>
		</Stack>
	);
}
