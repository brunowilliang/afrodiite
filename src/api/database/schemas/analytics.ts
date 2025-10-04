import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const analyticsEvents = sqliteTable(
	'analytics_events',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		escort_id: text('escort_id').notNull(),
		public_id: text('public_id').notNull(),
		event_type: text('event_type').notNull(),
		device: text('device').notNull(),
		hour: integer('hour').notNull(), // 0-23
		day: text('day').notNull(),
		created_at: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
	},
	(table) => [
		index('idx_escort_event').on(table.escort_id, table.event_type),
		index('idx_public_id').on(table.public_id),
		index('idx_created_at').on(table.created_at),
		index('idx_escort_date').on(table.escort_id, table.created_at),
		index('idx_escort_date_event').on(
			table.escort_id,
			table.created_at,
			table.event_type,
		),
		index('idx_hour_day').on(table.hour, table.day),
	],
);
