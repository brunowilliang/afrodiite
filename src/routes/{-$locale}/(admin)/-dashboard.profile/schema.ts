import z from 'zod';
import { DAYS, type Day, SLOTS, type Slot } from '@/api/utils/defaults/escort';

// Information
export const informationSchema = z.object({
	artist_name: z.string().min(1),
	slug: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/),
	description: z.string().min(1),
	birthday: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.nonempty(),
	nationality: z.string().min(1),
	phone: z.string().min(1),
	whatsapp: z.string().min(1),
});

// Location
export const locationSchema = z.object({
	country: z.string().min(1).default('Portugal'),
	state: z.string().min(1),
	city: z.string().min(1),
	neighborhood: z.string().min(1),
});

// Characteristics
export const characteristicsSchema = z.object({
	gender: z.string().min(1),
	age: z.coerce.number().min(18).max(100),
	height: z.coerce.number().min(1).max(250),
	weight: z.coerce.number().min(1),
	eye_color: z.string().min(1),
	hair_color: z.string().min(1),
	ethnicity: z.string().min(1),
	languages: z.string().min(1),
	sexual_preference: z.string().min(1),
	silicone: z.enum(['yes', 'no']),
	tattoos: z.enum(['yes', 'no']),
	piercings: z.enum(['yes', 'no']),
	smoker: z.enum(['yes', 'no']),
});

export type Characteristics = z.infer<typeof characteristicsSchema>;

// Office Hours
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const officeDaySchema = z
	.object({
		is_available: z.boolean(),
		start: z.string().regex(timeRegex),
		end: z.string().regex(timeRegex),
	})
	.superRefine((val, ctx) => {
		if (!val.is_available) return;
		// Simple HH:MM lexicographic comparison
		if ((val.start ?? '') >= (val.end ?? '')) {
			ctx.addIssue({ code: 'custom', message: 'Hora de início deve ser menor que a hora de fim', path: ['end'] });
		}
	});

export const officeHoursSchema = z.object(
	Object.fromEntries((DAYS as readonly Day[]).map((d) => [d, officeDaySchema])) as Record<Day, typeof officeDaySchema>,
);

export type OfficeHourItem = {
	day: Day;
	is_available: boolean;
	start: string;
	end: string;
};

// Prices
const priceSlotSchema = z.object({
	is_available: z.boolean(),
	amount: z.number().min(0),
	currency: z.literal('EUR'),
});

export const pricesSchema = z.object(
	Object.fromEntries((SLOTS as readonly Slot[]).map((s) => [s, priceSlotSchema])) as Record<Slot, typeof priceSlotSchema>,
);

export type PriceItem = {
	slot: Slot;
	is_available: boolean;
	amount: number;
	currency: 'EUR';
};

// Services & Gallery helpers (validation-only)
export type ServiceItem = number | { id: number; is_available?: boolean };
export type GalleryItem = { url?: string };

export type ProfileLike = {
	artist_name?: string;
	slug?: string;
	description?: string;
	birthday?: string;
	nationality?: string;
	phone?: string;
	whatsapp?: string;
	country?: string;
	state?: string;
	city?: string;
	neighborhood?: string;
	characteristics?: Partial<Characteristics>;
	office_hours?: OfficeHourItem[];
	prices?: PriceItem[];
	services?: ServiceItem[];
	gallery?: GalleryItem[];
};

export function isInformationComplete(profile: ProfileLike): boolean {
	return informationSchema.safeParse(profile).success;
}

export function isLocationComplete(profile: ProfileLike): boolean {
	return locationSchema.safeParse(profile).success;
}

export function isCharacteristicsComplete(profile: ProfileLike): boolean {
	return characteristicsSchema.safeParse(profile.characteristics ?? {}).success;
}

export function isOfficeHoursComplete(profile: ProfileLike): boolean {
	const items = Array.isArray(profile.office_hours) ? profile.office_hours : [];
	return items.some((it) => {
		if (!it?.is_available) return false;
		const s = (it?.start ?? '').trim();
		const e = (it?.end ?? '').trim();
		if (!/^\d{2}:\d{2}$/.test(s) || !/^\d{2}:\d{2}$/.test(e)) return false;
		return s < e;
	});
}

export function isPricesComplete(profile: ProfileLike): boolean {
	const prices = Array.isArray(profile.prices) ? profile.prices : [];
	return prices.some((p) => Boolean(p?.is_available) && (p?.amount ?? 0) > 0);
}

export function isServicesComplete(profile: ProfileLike): boolean {
	const sv = profile.services;
	if (!Array.isArray(sv) || sv.length === 0) return false;
	if (typeof sv[0] === 'number') return (sv as number[]).length > 0;
	return (sv as Array<{ id: number; is_available?: boolean }>).some((s) => !!s?.is_available);
}

export function isGalleryComplete(profile: ProfileLike, minPhotos = 5): boolean {
	const gallery = Array.isArray(profile.gallery) ? profile.gallery : [];
	const valid = gallery.filter((g) => typeof g?.url === 'string' && g.url.length > 0);
	return valid.length >= minPhotos;
}

export function computeOnboardingCompletion(profile: ProfileLike): boolean[] {
	return [
		isInformationComplete(profile),
		isLocationComplete(profile),
		isCharacteristicsComplete(profile),
		isOfficeHoursComplete(profile),
		isPricesComplete(profile),
		isServicesComplete(profile),
		isGalleryComplete(profile),
	];
}

