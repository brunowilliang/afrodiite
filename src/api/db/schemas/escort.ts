import {
	boolean,
	date,
	jsonb,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import type { GalleryItem } from '@/queries/uploadFile';
import { users } from './auth';

export type Characteristics = {
	gender?: string;
	age?: string;
	height?: string;
	weight?: string;
	hair_color?: string;
	eye_color?: string;
	sexual_preference?: string;
	ethnicity?: string;
	silicone?: boolean;
	tattoos?: boolean;
	piercings?: boolean;
	smoker?: boolean;
	languages?: string;
};

export type OfficeHours = {
	[K in
		| 'monday'
		| 'tuesday'
		| 'wednesday'
		| 'thursday'
		| 'friday'
		| 'saturday'
		| 'sunday']: {
		is_available: boolean;
		start: string;
		end: string;
	};
};

export type Prices = {
	[K in '30m' | '1h' | '2h' | '4h' | 'overnight' | 'daily' | 'travel_daily']: {
		is_available: boolean;
		amount?: number;
		currency?: 'EUR';
	};
};

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
	characteristics: jsonb('characteristics').$type<Characteristics>().default({
		age: '',
		height: '',
		weight: '',
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
	office_hours: jsonb('office_hours')
		.$type<OfficeHours>()
		.default({
			monday: { is_available: true, start: '00:00', end: '23:59' },
			tuesday: { is_available: true, start: '00:00', end: '23:59' },
			wednesday: { is_available: true, start: '00:00', end: '23:59' },
			thursday: { is_available: true, start: '00:00', end: '23:59' },
			friday: { is_available: true, start: '00:00', end: '23:59' },
			saturday: { is_available: true, start: '00:00', end: '23:59' },
			sunday: { is_available: true, start: '00:00', end: '23:59' },
		}),
	prices: jsonb('prices')
		.$type<Prices>()
		.default({
			'30m': { is_available: true, amount: 0, currency: 'EUR' },
			'1h': { is_available: true, amount: 0, currency: 'EUR' },
			'2h': { is_available: true, amount: 0, currency: 'EUR' },
			'4h': { is_available: true, amount: 0, currency: 'EUR' },
			overnight: { is_available: true, amount: 0, currency: 'EUR' },
			daily: { is_available: true, amount: 0, currency: 'EUR' },
			travel_daily: { is_available: true, amount: 0, currency: 'EUR' },
		}),
	services: jsonb('services').default({}),
	gallery: jsonb('gallery').$type<GalleryItem[]>().default([]),

	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
	last_active_at: timestamp('last_active_at'),
});
