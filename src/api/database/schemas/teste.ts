import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// src/api/database/schemas/reviews.ts
export const testeTable = sqliteTable('teste', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	description: text('description').notNull(),
});
