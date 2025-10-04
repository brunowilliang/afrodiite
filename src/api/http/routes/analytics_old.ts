import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { GoogleAuth } from 'google-auth-library';
import z from 'zod';
// import { authProcedure } from '@/api/http/middlewares';
import { env } from '@/env';
import { authProcedure } from '../middlewares';

const auth = new GoogleAuth({
	credentials: {
		client_email: env.GA_CLIENT_EMAIL,
		private_key: env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
	},
	scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
});

const analytics = new BetaAnalyticsDataClient({ auth });

const propertyId = `properties/${env.GA_PROPERTY_ID}`;

const AnalyticsSchema = {
	input: z.object({
		period: z
			.enum(['7daysAgo', '14daysAgo', '30daysAgo', '60daysAgo', '90daysAgo'])
			.default('7daysAgo'),
	}),
};

export namespace Analytics {
	export type Input = z.infer<typeof AnalyticsSchema.input>;
	export type Period = Input['period'];
}
// export type IStats = z.infer<typeof AnalyticsSchema.input>['period'];

export const analyticsRoutes = {
	stats: authProcedure
		.input(AnalyticsSchema.input)
		.handler(async ({ context, input }) => {
			const escort_id = context.session.user.id;
			const period = input.period;

			// const { escort_id, period } = input;

			// 1. Eventos básicos
			const [events] = await analytics.runReport({
				property: propertyId,
				dateRanges: [{ startDate: period, endDate: 'today' }],
				dimensions: [{ name: 'eventName' }],
				metrics: [{ name: 'eventCount' }],
				dimensionFilter: {
					andGroup: {
						expressions: [
							{
								filter: {
									fieldName: 'customEvent:escort_id',
									stringFilter: { value: escort_id },
								},
							},
							{
								filter: {
									fieldName: 'eventName',
									inListFilter: {
										values: ['profile_view', 'whatsapp_click', 'phone_click'],
									},
								},
							},
						],
					},
				},
			});

			// 2. Por device
			const [device] = await analytics.runReport({
				property: propertyId,
				dateRanges: [{ startDate: period, endDate: 'today' }],
				dimensions: [{ name: 'deviceCategory' }],
				metrics: [{ name: 'eventCount' }],
				dimensionFilter: {
					filter: {
						fieldName: 'customEvent:escort_id',
						stringFilter: { value: escort_id },
					},
				},
			});

			// 3. Por hora
			const [hours] = await analytics.runReport({
				property: propertyId,
				dateRanges: [{ startDate: period, endDate: 'today' }],
				dimensions: [{ name: 'hour' }],
				metrics: [{ name: 'eventCount' }],
				dimensionFilter: {
					filter: {
						fieldName: 'customEvent:escort_id',
						stringFilter: { value: escort_id },
					},
				},
			});

			// 4. Por dia da semana
			const [days] = await analytics.runReport({
				property: propertyId,
				dateRanges: [{ startDate: period, endDate: 'today' }],
				dimensions: [{ name: 'dayOfWeek' }],
				metrics: [{ name: 'eventCount' }],
				dimensionFilter: {
					filter: {
						fieldName: 'customEvent:escort_id',
						stringFilter: { value: escort_id },
					},
				},
			});

			// Processar dados
			const getEventCount = (name: string) =>
				events.rows?.find((r) => r.dimensionValues?.[0]?.value === name)
					?.metricValues?.[0]?.value || 0;

			const profile_views = Number(getEventCount('profile_view'));
			const whatsapp_clicks = Number(getEventCount('whatsapp_click'));
			const phone_clicks = Number(getEventCount('phone_click'));

			const mobile =
				device.rows?.find((r) => r.dimensionValues?.[0]?.value === 'mobile')
					?.metricValues?.[0]?.value || 0;

			const desktop =
				device.rows?.find((r) => r.dimensionValues?.[0]?.value === 'desktop')
					?.metricValues?.[0]?.value || 0;

			const bestHour =
				hours.rows?.sort(
					(a, b) =>
						Number(b.metricValues?.[0]?.value) -
						Number(a.metricValues?.[0]?.value),
				)?.[0]?.dimensionValues?.[0]?.value || '0';

			const bestDay =
				days.rows?.sort(
					(a, b) =>
						Number(b.metricValues?.[0]?.value) -
						Number(a.metricValues?.[0]?.value),
				)?.[0]?.dimensionValues?.[0]?.value || '0';

			// 5. Ranking geral
			const [ranking] = await analytics.runReport({
				property: propertyId,
				dateRanges: [{ startDate: period, endDate: 'today' }],
				dimensions: [{ name: 'customEvent:escort_id' }],
				metrics: [{ name: 'eventCount' }],
				dimensionFilter: {
					filter: {
						fieldName: 'eventName',
						stringFilter: { value: 'profile_view' },
					},
				},
				orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
			});

			const rankingPosition =
				ranking.rows?.findIndex(
					(r) => r.dimensionValues?.[0]?.value === escort_id,
				) ?? -1;

			return {
				profile_views,
				whatsapp_clicks,
				phone_clicks,
				conversion_rate:
					profile_views > 0
						? ((whatsapp_clicks / profile_views) * 100).toFixed(2)
						: '0',
				mobile_access: mobile,
				desktop_access: desktop,
				best_hour: bestHour,
				best_day: bestDay,
				ranking: rankingPosition === -1 ? null : rankingPosition + 1,
			};
		}),
};
