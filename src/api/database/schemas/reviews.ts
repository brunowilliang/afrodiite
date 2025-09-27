import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { escortProfiles } from './escort';

// src/api/database/schemas/reviews.ts
export const escortReviews = sqliteTable(
	'escort_reviews',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		escort_id: text('escort_id')
			.notNull()
			.references(() => escortProfiles.id, { onDelete: 'cascade' }),

		// Dados do reviewer
		reviewer_name: text('reviewer_name').notNull(),
		reviewer_email: text('reviewer_email'),
		reviewer_phone: text('reviewer_phone'),

		// Conteúdo do review
		rating: integer('rating').notNull(), // 1-5 stars
		title: text('title').notNull(),
		comment: text('comment').notNull(),

		// Sistema de moderação simples
		status: text('status', {
			enum: ['pending', 'approved', 'rejected'],
		})
			.$type<'pending' | 'approved' | 'rejected'>()
			.notNull()
			.default('pending'),

		// Resposta da escort
		escort_response: text('escort_response'),
		escort_responded_at: integer('escort_responded_at', { mode: 'timestamp' }),

		// Metadados básicos
		ip_address: text('ip_address'),

		created_at: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updated_at: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => [
		index('idx_reviews_escort_status').on(table.escort_id, table.status),
		index('idx_reviews_created_at').on(table.created_at),
		index('idx_reviews_rating').on(table.escort_id, table.rating),
	],
);
