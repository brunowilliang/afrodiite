import {
	boolean,
	date,
	jsonb,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import {
	type Characteristics,
	DEFAULT_CHARACTERISTICS,
	DEFAULT_OFFICE_HOURS,
	DEFAULT_PRICES,
	type GalleryItem,
	type OfficeHour,
	type Price,
} from '@/api/utils/defaults/escort';
import { users } from './auth';

export const escortProfiles = pgTable('escort_profiles', {
	id: text('id')
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),

	// Information
	name: text('name').notNull(),
	artist_name: text('artist_name'),
	slug: text('slug').unique(),
	description: text('description'),
	birthday: date('birthday'),
	phone: text('phone'),
	whatsapp: text('whatsapp'),
	email: text('email'),

	// Links
	links: jsonb('links').default({}),

	// Location
	city: text('city'),
	state: text('state'),
	country: text('country'),
	neighborhood: text('neighborhood'),
	nationality: text('nationality'),

	// Status
	is_active: boolean('is_active').default(false),
	is_verified: boolean('is_verified').default(false),

	// Content
	office_hours: jsonb('office_hours')
		.$type<OfficeHour[]>()
		.default(DEFAULT_OFFICE_HOURS),

	prices: jsonb('prices').$type<Price[]>().default(DEFAULT_PRICES),

	characteristics: jsonb('characteristics')
		.$type<Characteristics>()
		.default(DEFAULT_CHARACTERISTICS),

	services: jsonb('services').$type<number[]>().default([]),

	gallery: jsonb('gallery').$type<GalleryItem[]>().default([]),

	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
	last_active_at: timestamp('last_active_at'),
});
