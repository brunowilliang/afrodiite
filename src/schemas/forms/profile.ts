import { z } from 'zod';

// export const profileSchema = z.object({
// 	// Information

// 	// Links
// 	links: z
// 		.object({
// 			instagram: z.string().optional(),
// 			facebook: z.string().optional(),
// 			twitter: z.string().optional(),
// 			website: z.string().optional(),
// 			privacy: z.string().optional(),
// 			onlyfans: z.string().optional(),
// 		})
// 		.optional(),

// 	// Location
// 	city: z.string().optional(),
// 	state: z.string().optional(),
// 	country: z.string().optional(),
// 	neighborhood: z.string().optional(),
// 	nationality: z.string().optional(),

// 	// Content
// 	characteristics: z
// 		.object({
// 			age: z.number().min(18).optional(),
// 			height: z.number().min(100).max(250).optional(),
// 			weight: z.number().min(30).max(200).optional(),
// 			hairColor: z.string().optional(),
// 			eyeColor: z.string().optional(),
// 			measurements: z.string().optional(),
// 		})
// 		.optional(),

// 	services: z.array(z.string()).optional(),
// 	fetishes: z.array(z.string()).optional(),

// 	officeHours: z
// 		.object({
// 			monday: z
// 				.object({
// 					start: z.string(),
// 					end: z.string(),
// 					available: z.boolean(),
// 				})
// 				.optional(),
// 			tuesday: z
// 				.object({
// 					start: z.string(),
// 					end: z.string(),
// 					available: z.boolean(),
// 				})
// 				.optional(),
// 			wednesday: z
// 				.object({
// 					start: z.string(),
// 					end: z.string(),
// 					available: z.boolean(),
// 				})
// 				.optional(),
// 			thursday: z
// 				.object({
// 					start: z.string(),
// 					end: z.string(),
// 					available: z.boolean(),
// 				})
// 				.optional(),
// 			friday: z
// 				.object({
// 					start: z.string(),
// 					end: z.string(),
// 					available: z.boolean(),
// 				})
// 				.optional(),
// 			saturday: z
// 				.object({
// 					start: z.string(),
// 					end: z.string(),
// 					available: z.boolean(),
// 				})
// 				.optional(),
// 			sunday: z
// 				.object({
// 					start: z.string(),
// 					end: z.string(),
// 					available: z.boolean(),
// 				})
// 				.optional(),
// 		})
// 		.optional(),

// 	prices: z
// 		.array(
// 			z.object({
// 				name: z.string(),
// 				duration: z.number(),
// 				price: z.number().min(0),
// 			}),
// 		)
// 		.optional(),

// 	gallery: z
// 		.array(
// 			z.object({
// 				id: z.string(),
// 				type: z.enum(['image', 'video']),
// 				url: z.string().url(),
// 				isPrimary: z.boolean(),
// 				order: z.number(),
// 			}),
// 		)
// 		.optional(),

// 	// Status
// 	isActive: z.boolean().optional(),
// 	isVerified: z.boolean().optional(),

// 	// Timestamps
// 	createdAt: z.string().optional(),
// 	updatedAt: z.string().optional(),
// 	lastActiveAt: z.string().optional(),
// });

export const informationSchema = z.object({
	artist_name: z.string().optional(),
	slug: z
		.string()
		.min(3)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message: 'Slug deve conter apenas letras minúsculas, números e hífens',
		})
		.optional(),
	description: z.string().max(1500).optional(),
	birthday: z
		.string()
		.refine((val) => !val || !Number.isNaN(Date.parse(val)), {
			message: 'Data inválida',
		})
		.optional(),
	phone: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, {
			message: 'Número de telefone inválido',
		})
		.optional(),
	whatsapp: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, {
			message: 'Número de WhatsApp inválido',
		})
		.optional(),
	nationality: z.string().optional(),
});

export const locationSchema = z.object({
	city: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional(),
	neighborhood: z.string().optional(),
});

export const characteristicsSchema = z.object({
	age: z.string().optional(),
	height: z.string().optional(),
	weight: z.string().optional(),
	hairColor: z.string().optional(),
	eyeColor: z.string().optional(),
	measurements: z.string().optional(),
});

export const profileSchema = {
	information: informationSchema,
	location: locationSchema,
	characteristics: characteristicsSchema,
};

export type EscortProfile = {
	information: z.infer<typeof informationSchema>;
	location: z.infer<typeof locationSchema>;
	characteristics: z.infer<typeof characteristicsSchema>;
};

// export type ProfileForm = z.infer<typeof profileSchema>;
