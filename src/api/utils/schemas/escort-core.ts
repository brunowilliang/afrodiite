// src/api/utils/schemas/escort-core.ts
import { z } from 'zod';

// 1. Schemas BASE (sem validações de formulário)
export const DayEnum = z.enum([
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday',
] as const);

export const SlotEnum = z.enum([
	'30m',
	'1h',
	'2h',
	'4h',
	'overnight',
	'daily',
	'travel',
	'outcall',
] as const);

// 2. Schemas de DADOS (estrutura + defaults)
export const OfficeHourSchema = z.object({
	day: DayEnum,
	is_available: z.boolean().default(false),
	start: z.string().default('00:00'),
	end: z.string().default('23:59'),
});

export const PriceSchema = z.object({
	slot: SlotEnum,
	is_available: z.boolean().default(false),
	amount: z.number().default(0),
	negotiated: z.boolean().default(false),
	currency: z.literal('EUR').default('EUR'),
});

export const CharacteristicsSchema = z.object({
	gender: z.string().default(''),
	age: z.number().default(0),
	height: z.number().default(0),
	weight: z.number().default(0),
	hair_color: z.string().default(''),
	eye_color: z.string().default(''),
	sexual_preference: z.string().default(''),
	ethnicity: z.string().default(''),
	silicone: z.boolean().default(false),
	tattoos: z.boolean().default(false),
	piercings: z.boolean().default(false),
	smoker: z.boolean().default(false),
	languages: z.string().default(''),
});

export const GallerySchema = z.object({
	id: z.string(),
	path: z.string(),
	url: z.url(),
	size: z.number(),
	order: z.number(),
	createdAt: z.string(),
});

// 3. Funções para gerar defaults
export const createDefaults = {
	officeHours: () =>
		DayEnum.options.map((day) => OfficeHourSchema.parse({ day })),
	prices: () => SlotEnum.options.map((slot) => PriceSchema.parse({ slot })),
	characteristics: () => CharacteristicsSchema.parse({}),
	gallery: () => [] as GalleryItem[],
};

// 4. Tipos base
export type Day = z.infer<typeof DayEnum>;
export type Slot = z.infer<typeof SlotEnum>;
export type OfficeHour = z.infer<typeof OfficeHourSchema>;
export type Price = z.infer<typeof PriceSchema>;
export type Characteristics = z.infer<typeof CharacteristicsSchema>;
export type GalleryItem = z.infer<typeof GallerySchema>;
