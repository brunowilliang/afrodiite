import { z } from 'zod';
import { createCrud } from '@/api/db';
import { analyticsEvents } from '@/api/db/schemas/analytics';
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

const DashboardSchema = {
	input: z.object({
		period: z.enum(['7d', '30d', '90d']).default('30d'),
	}),
};

export const analyticsRoutes = {
	track: publicProcedure.input(TrackSchema.input).handler(async ({ input }) => {
		const result = await analytics.create({
			escort_id: input.escort_id,
			event_type: input.event_type,
			user_session: input.user_session,
			metadata: input.metadata,
		});

		return { success: true, id: result.id };
	}),
	dashboard: authProcedure
		.input(DashboardSchema.input)
		.handler(async ({ input, context }) => {
			// Calcular período
			const now = new Date();
			const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
			const startDate = new Date(
				now.getTime() - daysMap[input.period] * 24 * 60 * 60 * 1000,
			).toISOString();

			const events = await analytics.list({
				filters: {
					escort_id: context.session.user.id,
					created_at: { gte: startDate },
				},
				perPage: 100000,
			});

			// Agregar dados
			const stats = events.results.reduce(
				(acc: Record<string, number>, event: any) => {
					acc[event.event_type] = (acc[event.event_type] || 0) + 1;
					return acc;
				},
				{},
			);

			// Métricas derivadas
			const views = stats['profile_view'] || 0;
			const whatsappClicks = stats['whatsapp_click'] || 0;
			const phoneClicks = stats['phone_click'] || 0;
			const totalClicks = whatsappClicks + phoneClicks;

			return {
				period: input.period,
				summary: {
					views,
					whatsapp_clicks: whatsappClicks,
					phone_clicks: phoneClicks,
					total_clicks: totalClicks,
					conversion_rate:
						views > 0 ? ((totalClicks / views) * 100).toFixed(2) : '0',
				},
				total_events: events.totalItems,
			};
		}),
};
