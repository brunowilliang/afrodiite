import {
	boolean,
	date,
	jsonb,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './auth';

export const escortProfiles = pgTable('escort_profiles', {
	id: text('id')
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),

	// Information
	name: text('name').notNull(),
	artistName: text('artist_name'),
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
	country: text('country').default('PT'),
	neighborhood: text('neighborhood'),
	nationality: text('nationality'),

	// Status
	isActive: boolean('is_active').default(false),
	isVerified: boolean('is_verified').default(false),

	// Content
	characteristics: jsonb('characteristics').default({}),
	services: jsonb('services').default([]),
	officeHours: jsonb('office_hours').default({}),
	fetishes: jsonb('fetishes').default([]),
	prices: jsonb('prices').default([]),
	gallery: jsonb('gallery').default([]),

	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	lastActiveAt: timestamp('last_active_at'),
});
