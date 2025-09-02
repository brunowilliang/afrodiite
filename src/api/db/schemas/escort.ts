import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
	DEFAULT_CHARACTERISTICS,
	DEFAULT_OFFICE_HOURS,
	DEFAULT_PRICES,
} from '@/api/utils/defaults/escort';
import type {
	Characteristics,
	GalleryItem,
	OfficeHour,
	Price,
} from '@/api/utils/types/escort';
import { users } from './auth';

export const escortProfiles = sqliteTable('escort_profiles', {
	id: text('id')
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),
	public_id: integer('public_id').unique(),

	// Information
	name: text('name').notNull(),
	artist_name: text('artist_name'),
	slug: text('slug').unique(),
	description: text('description'),
	birthday: text('birthday'),
	phone: text('phone'),
	whatsapp: text('whatsapp'),
	email: text('email'),
	nationality: text('nationality'),

	// Links (armazenado como JSON em TEXT)
	links: text('links', { mode: 'json' })
		.$type<Record<string, unknown>>()
		.default({}),

	// Location
	district: text('district'),
	city: text('city'),
	country: text('country'),

	// Status
	is_active: integer('is_active', { mode: 'boolean' }).$defaultFn(() => false),
	is_verified: integer('is_verified', { mode: 'boolean' }).$defaultFn(
		() => false,
	),

	// Content (JSON em TEXT)
	office_hours: text('office_hours', { mode: 'json' })
		.$type<OfficeHour[]>()
		.default(DEFAULT_OFFICE_HOURS),

	prices: text('prices', { mode: 'json' })
		.$type<Price[]>()
		.default(DEFAULT_PRICES),

	characteristics: text('characteristics', { mode: 'json' })
		.$type<Characteristics>()
		.default(DEFAULT_CHARACTERISTICS),

	services: text('services', { mode: 'json' }).$type<number[]>().default([]),

	gallery: text('gallery', { mode: 'json' }).$type<GalleryItem[]>().default([]),

	created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
	updated_at: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
	last_active_at: integer('last_active_at', { mode: 'timestamp' }),
});
