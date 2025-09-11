import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const analyticsEvents = sqliteTable(
	'analytics_events',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		escort_id: text('escort_id').notNull(),
		event_type: text('event_type').notNull(),
		user_session: text('user_session'),
		metadata: text('metadata', { mode: 'json' }),
		// Campos para análise temporal
		hour: integer('hour'), // 0-23
		day_of_week: integer('day_of_week'), // 0-6

		created_at: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
	},
	(table) => [
		index('idx_escort_event').on(table.escort_id, table.event_type),
		index('idx_created_at').on(table.created_at),
		index('idx_escort_date').on(table.escort_id, table.created_at),
		index('idx_escort_date_event').on(
			table.escort_id,
			table.created_at,
			table.event_type,
		),
		index('idx_hour_day').on(table.hour, table.day_of_week),
	],
);
