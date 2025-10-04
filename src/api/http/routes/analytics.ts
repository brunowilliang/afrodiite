import { z } from 'zod';
import { createCrud } from '@/api/database';
import { analyticsEvents } from '@/api/database/schemas/analytics';
import { authProcedure, publicProcedure } from '@/api/http/middlewares';

// ✅ Drizzle-CRUD setup
const analytics = createCrud(analyticsEvents, {
	searchFields: ['event_type'],
	allowedFilters: ['escort_id', 'event_type'],
});

// ✅ Schemas Zod v4 - EXPORTADOS
export const TrackSchema = {
	input: z.object({
		escort_id: z.string().min(1),
		public_id: z.string().min(1),
		event_type: z.enum(['profile_view', 'whatsapp_click', 'phone_click']),
		device: z.enum(['mobile', 'desktop']),
	}),
};

const StatsSchema = {
	input: z.object({
		period: z
			.enum(['7daysAgo', '14daysAgo', '30daysAgo', '60daysAgo', '90daysAgo'])
			.default('7daysAgo'),
	}),
};

export namespace IAnalytics {
	export type Input = z.infer<typeof TrackSchema.input>;
	export type Period = z.infer<typeof StatsSchema.input>['period'];
}

export const analyticsRoutes = {
	track: publicProcedure.input(TrackSchema.input).handler(async ({ input }) => {
		// Calculate hour and day automatically
		const now = new Date();
		const hour = now.getHours(); // 0-23
		const days = [
			'sunday',
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday',
		];
		const day = days[now.getDay()];

		// Save to database
		await analytics.create({
			escort_id: input.escort_id,
			public_id: input.public_id,
			event_type: input.event_type,
			device: input.device,
			hour,
			day,
		});

		return { success: true };
	}),
	stats: authProcedure
		.input(StatsSchema.input)
		.handler(async ({ context, input }) => {
			// 1. Get escort_id from authenticated user
			const escort_id = context.session.user.id;

			// 2. Convert period to start date
			const daysAgo = Number.parseInt(input.period.replace('daysAgo', ''));
			const startDate = new Date();
			startDate.setDate(startDate.getDate() - daysAgo);
			startDate.setHours(0, 0, 0, 0);

			// 3. Fetch all events from period
			const { results: events } = await analytics.list({
				filters: {
					escort_id,
					created_at: { gte: startDate.toISOString() },
				},
				perPage: 100000, // Large number to get all events
			});

			// 4. Calculate metrics
			// ✅ Metric 1: profile_views
			const profile_views = events.filter(
				(e) => e.event_type === 'profile_view',
			).length;

			// ✅ Metric 2: whatsapp_clicks
			const whatsapp_clicks = events.filter(
				(e) => e.event_type === 'whatsapp_click',
			).length;

			// ✅ Metric 3: phone_clicks
			const phone_clicks = events.filter(
				(e) => e.event_type === 'phone_click',
			).length;

			// ✅ Metric 4: whatsapp_conversion
			const whatsapp_conversion =
				profile_views > 0
					? ((whatsapp_clicks / profile_views) * 100).toFixed(2)
					: '0.00';

			// ✅ Metric 5: phone_conversion
			const phone_conversion =
				profile_views > 0
					? ((phone_clicks / profile_views) * 100).toFixed(2)
					: '0.00';

			// ✅ Metric 6: mobile_access (only profile_views)
			const mobile_access = events.filter(
				(e) => e.event_type === 'profile_view' && e.device === 'mobile',
			).length;

			// ✅ Metric 7: desktop_access (only profile_views)
			const desktop_access = events.filter(
				(e) => e.event_type === 'profile_view' && e.device === 'desktop',
			).length;

			// ✅ Metric 8: mobile_percentage
			const total_device_views = mobile_access + desktop_access;
			const mobile_percentage =
				total_device_views > 0
					? ((mobile_access / total_device_views) * 100).toFixed(2)
					: '0.00';

			// ✅ Metric 9: desktop_percentage
			const desktop_percentage =
				total_device_views > 0
					? ((desktop_access / total_device_views) * 100).toFixed(2)
					: '0.00';

			// ✅ Metric 10: best_hour
			const hourCounts = events.reduce(
				(acc, e) => {
					acc[e.hour] = (acc[e.hour] || 0) + 1;
					return acc;
				},
				{} as Record<number, number>,
			);
			const best_hour =
				Object.keys(hourCounts).length > 0
					? Number(
							Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0][0],
						)
					: 0;

			// ✅ Metric 11: best_day
			const dayCounts = events.reduce(
				(acc, e) => {
					acc[e.day] = (acc[e.day] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>,
			);
			const best_day =
				Object.keys(dayCounts).length > 0
					? Object.entries(dayCounts).sort(([, a], [, b]) => b - a)[0][0]
					: 'monday';

			// ✅ Metric 12: ranking
			const { results: allProfileViews } = await analytics.list({
				filters: {
					event_type: 'profile_view',
					created_at: { gte: startDate.toISOString() },
				},
				perPage: 100000,
			});

			const escortViewCounts = allProfileViews.reduce(
				(acc, e) => {
					acc[e.escort_id] = (acc[e.escort_id] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>,
			);

			const sortedEscorts = Object.entries(escortViewCounts)
				.map(([id, count]) => ({ escort_id: id, views: count }))
				.sort((a, b) => b.views - a.views);

			const ranking =
				sortedEscorts.findIndex((e) => e.escort_id === escort_id) + 1 || 0;

			return {
				profile_views,
				whatsapp_clicks,
				phone_clicks,
				whatsapp_conversion,
				phone_conversion,
				mobile_access,
				desktop_access,
				mobile_percentage,
				desktop_percentage,
				best_hour,
				best_day,
				ranking,
			};
		}),
};
