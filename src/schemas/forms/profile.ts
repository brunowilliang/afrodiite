import { createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';
import { escortProfiles } from '@/api/db/schemas/escort';

// Normaliza null/undefined e trim
const normalizedString = () =>
	z
		.string()
		.nullish()
		.transform((v) => (v ?? '').trim());

export const required = (msg: string) =>
	normalizedString().pipe(z.string().min(1, msg));

export const escortProfilesSchema = createUpdateSchema(escortProfiles);

export const profileSchema = {
	information: escortProfilesSchema.pick({
		artist_name: true,
		slug: true,
		description: true,
		birthday: true,
		nationality: true,
		phone: true,
		whatsapp: true,
	}),
	location: escortProfilesSchema.pick({
		city: true,
		state: true,
		country: true,
		neighborhood: true,
	}),
	characteristics: escortProfilesSchema.pick({
		characteristics: true,
	}),
	office_hours: escortProfilesSchema.pick({
		office_hours: true,
	}),
	prices: escortProfilesSchema.pick({
		prices: true,
	}),
	services: escortProfilesSchema.pick({
		services: true,
	}),
	gallery: escortProfilesSchema.pick({
		gallery: true,
	}),
};

export type EscortProfile = {
	information: z.infer<typeof profileSchema.information>;
	location: z.infer<typeof profileSchema.location>;
	characteristics: z.infer<typeof profileSchema.characteristics>;
	office_hours: z.infer<typeof profileSchema.office_hours>;
	prices: z.infer<typeof profileSchema.prices>;
	services: z.infer<typeof profileSchema.services>;
	gallery: z.infer<typeof profileSchema.gallery>['gallery'];
};
