import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { escortProfiles } from '@/api/db/schemas/escort';
import { DAYS, SLOTS } from '@/api/utils/defaults/escort';

export type Day = (typeof DAYS)[number];

export type Slot = (typeof SLOTS)[number];

export type OfficeHour = {
	day: Day;
	is_available: boolean;
	start: string;
	end: string;
};

export type Price = {
	slot: Slot;
	is_available: boolean;
	amount?: number;
	currency?: 'EUR';
};

export type GalleryItem = {
	id: string;
	path: string;
	url: string;
	size: number;
	width: number;
	height: number;
	order: number;
	createdAt: string;
};

export type Characteristics = {
	gender: string;
	age: number;
	height: number;
	weight: number;
	hair_color: string;
	eye_color: string;
	sexual_preference: string;
	ethnicity: string;
	silicone: boolean;
	tattoos: boolean;
	piercings: boolean;
	smoker: boolean;
	languages: string;
};

export const profileSelectSchema = createSelectSchema(escortProfiles);
export const profileUpdateSchema = createUpdateSchema(escortProfiles);
export const profileInsertSchema = createInsertSchema(escortProfiles);

export type ProfileSelect = z.infer<typeof profileSelectSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type ProfileInsert = z.infer<typeof profileInsertSchema>;
