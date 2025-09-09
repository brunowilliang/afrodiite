import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const analyticsEvents = sqliteTable(
	'analytics_events',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		escort_id: text('escort_id').notNull(),
		event_type: text('event_type').notNull(), // 'profile_view', 'whatsapp_click', 'phone_click', 'email_click'
		user_session: text('user_session'), // Para evitar spam (opcional)
		metadata: text('metadata', { mode: 'json' }), // JSON
		created_at: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
	},
	(table) => [
		// ✅ FORMA CORRETA - retorna array de índices
		index('idx_escort_event').on(table.escort_id, table.event_type),
		index('idx_created_at').on(table.created_at),
		index('idx_escort_date').on(table.escort_id, table.created_at),
		// Índice composto para queries de range por escort + data
		index('idx_escort_date_event').on(
			table.escort_id,
			table.created_at,
			table.event_type,
		),
	],
);
