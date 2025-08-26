import {
	boolean,
	date,
	jsonb,
	pgSequence,
	pgTable,
	text,
	bigint,
	timestamp,
} from 'drizzle-orm/pg-core';
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
import { sql } from 'drizzle-orm';

export const escortPublicIdSeq = pgSequence('escort_public_id_seq', { startWith: 1000 });


export const escortProfiles = pgTable('escort_profiles', {
	id: text('id')
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),
		public_id: bigint('public_id', { mode: 'number' }).notNull().unique().default(sql`nextval('escort_public_id_seq')`),

	// Information
	name: text('name').notNull(),
	artist_name: text('artist_name'),
	slug: text('slug').unique(),
	description: text('description'),
	birthday: date('birthday'),
	phone: text('phone'),
	whatsapp: text('whatsapp'),
	email: text('email'),
	nationality: text('nationality'),

	// Links
	links: jsonb('links').default({}),

	// Location
	district: text('district'),
	city: text('city'),
	country: text('country'),

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
