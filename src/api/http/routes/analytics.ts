import { z } from 'zod';
import { createCrud } from '@/api/database';
import { analyticsEvents } from '@/api/database/schemas/analytics';
import { authProcedure, publicProcedure } from '@/api/http/middlewares';

// ✅ Drizzle-CRUD setup
const analytics = createCrud(analyticsEvents, {
	searchFields: ['event_type'],
	allowedFilters: ['escort_id', 'event_type', 'user_session'],
});

// ✅ Schemas Zod v4 - EXPORTADOS
export const TrackSchema = {
	input: z.object({
		escort_id: z.string().min(1),
		event_type: z.enum(['profile_view', 'whatsapp_click', 'phone_click']),
		user_session: z.string().optional(),
		metadata: z
			.object({
				user_agent: z.string().optional(),
				referrer: z.string().optional(),
				device: z.enum(['mobile', 'desktop']).optional(),
				source: z.string().optional(),
			})
			.loose()
			.optional(),
	}),
};

const StatsSchema = {
	input: z.object({
		period: z.enum(['7d', '14d', '30d', '60d', '90d']).default('7d'),
	}),
};

export type IStats = z.infer<typeof StatsSchema.input>['period'];

export const analyticsRoutes = {
	track: publicProcedure.input(TrackSchema.input).handler(async ({ input }) => {
		const now = new Date();

		const result = await analytics.create({
			escort_id: input.escort_id,
			event_type: input.event_type,
			user_session: input.user_session,
			metadata: input.metadata,
			hour: now.getHours(),
			day_of_week: now.getDay(),
		});

		return { success: true, id: result.id };
	}),
	stats: authProcedure
		.input(StatsSchema.input)
		.handler(async ({ input, context }) => {
			const now = new Date();
			const daysMap = { '7d': 7, '14d': 14, '30d': 30, '60d': 60, '90d': 90 };
			const startDate = new Date(
				now.getTime() - daysMap[input.period] * 24 * 60 * 60 * 1000,
			);

			// Buscar eventos
			const [events, rankingData] = await Promise.all([
				analytics.list({
					filters: {
						escort_id: context.session.user.id,
						created_at: { gte: startDate.toISOString() },
					},
					perPage: 100000,
				}),
				getRanking(context.session.user.id, startDate),
			]);

			// Métricas básicas
			type EventStats = {
				profile_view?: number;
				whatsapp_click?: number;
				phone_click?: number;
			};

			const stats = events.results.reduce<EventStats>((acc, event: any) => {
				const eventType = event.event_type as keyof EventStats;
				acc[eventType] = (acc[eventType] || 0) + 1;
				return acc;
			}, {});

			// Device breakdown
			const deviceStats = events.results.reduce(
				(acc: { mobile: number; desktop: number }, event: any) => {
					const device = event.metadata?.device as
						| 'mobile'
						| 'desktop'
						| undefined;
					if (device && (device === 'mobile' || device === 'desktop')) {
						acc[device]++;
					}
					return acc;
				},
				{ mobile: 0, desktop: 0 },
			);

			// Performance por hora (melhorada)
			const hourlyPerformance = Array.from({ length: 24 }, (_, hour) => {
				const hourEvents = events.results.filter((e: any) => e.hour === hour);
				const views = hourEvents.filter(
					(e: any) => e.event_type === 'profile_view',
				).length;
				const clicks = hourEvents.filter((e: any) =>
					['whatsapp_click', 'phone_click'].includes(e.event_type),
				).length;

				return {
					hour,
					hour_label: `${hour.toString().padStart(2, '0')}:00`,
					views,
					clicks,
					conversion:
						views > 0 ? Math.min((clicks / views) * 100, 100).toFixed(1) : '0',
				};
			});

			// Performance por dia
			const weekDays = [
				'Domingo',
				'Segunda',
				'Terça',
				'Quarta',
				'Quinta',
				'Sexta',
				'Sábado',
			];
			const dailyPerformance = Array.from({ length: 7 }, (_, day) => {
				const dayEvents = events.results.filter(
					(e: any) => e.day_of_week === day,
				);
				const views = dayEvents.filter(
					(e: any) => e.event_type === 'profile_view',
				).length;
				const clicks = dayEvents.filter((e: any) =>
					['whatsapp_click', 'phone_click'].includes(e.event_type),
				).length;

				return {
					day_index: day,
					day_name: weekDays[day],
					views,
					clicks,
					conversion:
						views > 0 ? Math.min((clicks / views) * 100, 100).toFixed(1) : '0',
				};
			});

			// Identificar melhores horários e dias
			const peakHours = [...hourlyPerformance]
				.sort((a, b) => b.views + b.clicks - (a.views + a.clicks))
				.slice(0, 3);

			const bestDays = [...dailyPerformance]
				.sort((a, b) => b.views + b.clicks - (a.views + a.clicks))
				.slice(0, 3);

			// Métricas finais
			const views = stats.profile_view || 0;
			const whatsappClicks = stats.whatsapp_click || 0;
			const phoneClicks = stats.phone_click || 0;
			const totalClicks = whatsappClicks + phoneClicks;
			const totalDevice = deviceStats.mobile + deviceStats.desktop;

			return {
				period: input.period,
				summary: {
					views,
					whatsapp_clicks: whatsappClicks,
					phone_clicks: phoneClicks,
					total_clicks: totalClicks,
					conversion_rate:
						views > 0
							? Math.min((totalClicks / views) * 100, 100).toFixed(2)
							: '0',
				},
				ranking: {
					position: rankingData.position,
					total_escorts: rankingData.total,
					percentile: rankingData.percentile,
					is_top_30: rankingData.position > 0 && rankingData.position <= 30,
					trend: 'stable', // Você pode implementar comparação com período anterior
				},
				devices: {
					mobile: {
						count: deviceStats.mobile,
						percentage:
							totalDevice > 0
								? ((deviceStats.mobile / totalDevice) * 100).toFixed(1)
								: '0',
					},
					desktop: {
						count: deviceStats.desktop,
						percentage:
							totalDevice > 0
								? ((deviceStats.desktop / totalDevice) * 100).toFixed(1)
								: '0',
					},
				},
				performance: {
					hourly: hourlyPerformance,
					daily: dailyPerformance,
					insights: {
						peak_hours: peakHours.map((h) => ({
							hour: h.hour_label,
							activity: h.views + h.clicks,
						})),
						best_days: bestDays.map((d) => ({
							day: d.day_name,
							activity: d.views + d.clicks,
						})),
					},
				},
				total_events: events.totalItems,
			};
		}),
};

// Função auxiliar para ranking usando drizzle-crud
async function getRanking(escortId: string, startDate: Date) {
	try {
		// Buscar TODOS os eventos de profile_view do período
		const allEvents = await analytics.list({
			filters: {
				event_type: 'profile_view',
				created_at: { gte: startDate.toISOString() },
			},
			perPage: 1000000, // Buscar todos
		});

		// Agrupar e contar em memória
		const escortCounts = allEvents.results.reduce(
			(acc: Record<string, number>, event: any) => {
				acc[event.escort_id] = (acc[event.escort_id] || 0) + 1;
				return acc;
			},
			{},
		);

		// Converter para array e ordenar
		const sortedEscorts = Object.entries(escortCounts)
			.map(([escort_id, count]) => ({ escort_id, total_views: count }))
			.sort((a, b) => b.total_views - a.total_views);

		const position =
			sortedEscorts.findIndex((e) => e.escort_id === escortId) + 1;
		const total = sortedEscorts.length;
		const percentile =
			position > 0 ? (((total - position + 1) / total) * 100).toFixed(1) : '0';

		return {
			position: position || 0,
			total,
			percentile,
		};
	} catch (error) {
		console.error('Error calculating ranking:', error);
		return { position: 0, total: 0, percentile: '0' };
	}
}
