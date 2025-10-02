import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
	type Characteristics,
	GalleryItem,
	type OfficeHour,
	type Price,
} from '@/api/utils/schemas/escort-core';
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
		.$type<Record<string, {}>>()
		.default({}),

	// Location
	district: text('district'),
	city: text('city'),
	country: text('country'),

	// Status
	is_visible: integer('is_visible', { mode: 'boolean' }).default(false),
	is_onboarding_complete: integer('is_onboarding_complete', {
		mode: 'boolean',
	}).default(false),

	// Content (JSON em TEXT)
	office_hours: text('office_hours', { mode: 'json' })
		.$type<OfficeHour[]>()
		.default([
			{ day: 'monday', is_available: false, start: '00:00', end: '23:59' },
			{ day: 'tuesday', is_available: false, start: '00:00', end: '23:59' },
			{ day: 'wednesday', is_available: false, start: '00:00', end: '23:59' },
			{ day: 'thursday', is_available: false, start: '00:00', end: '23:59' },
			{ day: 'friday', is_available: false, start: '00:00', end: '23:59' },
			{ day: 'saturday', is_available: false, start: '00:00', end: '23:59' },
			{ day: 'sunday', is_available: false, start: '00:00', end: '23:59' },
		]),

	prices: text('prices', { mode: 'json' })
		.$type<Price[]>()
		.default([
			{
				slot: '30m',
				is_available: false,
				amount: 0,
				negotiated: false,
				currency: 'EUR',
			},
			{
				slot: '1h',
				is_available: false,
				amount: 0,
				negotiated: false,
				currency: 'EUR',
			},
			{
				slot: '2h',
				is_available: false,
				amount: 0,
				negotiated: false,
				currency: 'EUR',
			},
			{
				slot: '4h',
				is_available: false,
				amount: 0,
				negotiated: false,
				currency: 'EUR',
			},
			{
				slot: 'overnight',
				is_available: false,
				amount: 0,
				negotiated: false,
				currency: 'EUR',
			},
			{
				slot: 'daily',
				is_available: false,
				amount: 0,
				negotiated: false,
				currency: 'EUR',
			},
			{
				slot: 'travel',
				is_available: false,
				amount: 0,
				negotiated: false,
				currency: 'EUR',
			},
			{
				slot: 'outcall',
				is_available: false,
				amount: 0,
				negotiated: false,
				currency: 'EUR',
			},
		]),

	characteristics: text('characteristics', { mode: 'json' })
		.$type<Characteristics>()
		.default({
			gender: '',
			age: 0,
			height: 0,
			weight: 0,
			hair_color: '',
			eye_color: '',
			sexual_preference: '',
			ethnicity: '',
			silicone: false,
			tattoos: false,
			piercings: false,
			smoker: false,
			languages: '',
		}),

	services: text('services', { mode: 'json' }).$type<number[]>().default([]),

	gallery: text('gallery', { mode: 'json' }).$type<GalleryItem[]>().default([]),

	blocked_countries: text('blocked_countries', { mode: 'json' })
		.$type<string[]>()
		.default([]),

	created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
	updated_at: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
	last_active_at: integer('last_active_at', { mode: 'timestamp' }),
});
