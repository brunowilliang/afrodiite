// import { z } from 'zod';
// import type { Day, Slot } from '@/api/utils/schemas/escort-core';
// import { DayEnum, SlotEnum } from '@/api/utils/schemas/escort-core';
// import { escortProfileSchema } from '@/api/utils/schemas/escort-forms';

// export const informationSchema = escortProfileSchema.pick({
// 	artist_name: true,
// 	slug: true,
// 	description: true,
// 	birthday: true,
// 	nationality: true,
// 	phone: true,
// 	whatsapp: true,
// });

// export const locationSchema = escortProfileSchema.pick({
// 	country: true,
// 	district: true,
// 	city: true,
// });

// export const characteristicsSchema = escortProfileSchema.pick({
// 	characteristics: true,
// });

// // Schema para formulário de office hours (por dia)
// const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
// export const officeHoursSchema = z
// 	.object(
// 		Object.fromEntries(
// 			(DayEnum.options as readonly Day[]).map((day) => [
// 				day,
// 				z
// 					.object({
// 						is_available: z.boolean(),
// 						start: z.string().regex(timeRegex),
// 						end: z.string().regex(timeRegex),
// 					})
// 					.superRefine((val, ctx) => {
// 						if (!val.is_available) return;
// 						if ((val.start ?? '') >= (val.end ?? '')) {
// 							ctx.addIssue({
// 								code: 'custom',
// 								message: 'Hora de início deve ser menor que a hora de fim',
// 								path: ['end'],
// 							});
// 						}
// 					}),
// 			]),
// 		) as Record<Day, z.ZodObject<any>>,
// 	)
// 	.superRefine((val, ctx) => {
// 		const anyActive = Object.values(val).some((v: any) => !!v.is_available);
// 		if (!anyActive) {
// 			const firstDay = (DayEnum.options as readonly Day[])[0];
// 			ctx.addIssue({
// 				code: 'custom',
// 				message: 'Ative pelo menos um dia para salvar os horários.',
// 				path: [firstDay, 'is_available'],
// 			});
// 		}
// 	});

// // Schema para formulário de preços (por slot)
// export const pricesSchema = z
// 	.object(
// 		Object.fromEntries(
// 			(SlotEnum.options as readonly Slot[]).map((slot) => [
// 				slot,
// 				z
// 					.object({
// 						is_available: z.boolean(),
// 						amount: z.number().optional(),
// 						negotiated: z.boolean().optional(),
// 						currency: z.literal('EUR').optional(),
// 					})
// 					.superRefine((val, ctx) => {
// 						if (val.is_available && !val.negotiated && (val.amount ?? 0) < 40) {
// 							ctx.addIssue({
// 								code: 'custom',
// 								message:
// 									'Quando ativo, o valor deve ser pelo menos €40 ou marque "A combinar".',
// 								path: ['amount'],
// 							});
// 						}
// 					}),
// 			]),
// 		) as Record<Slot, z.ZodObject<any>>,
// 	)
// 	.superRefine((val, ctx) => {
// 		// Pelo menos um slot deve estar ativo (com valor >= 40 ou negociado)
// 		const anyValid = Object.values(val).some(
// 			(v: any) => !!v.is_available && ((v.amount ?? 0) >= 40 || !!v.negotiated),
// 		);
// 		if (!anyValid) {
// 			const firstSlot = (SlotEnum.options as readonly Slot[])[0];
// 			ctx.addIssue({
// 				code: 'custom',
// 				message: 'Pelo menos um item deve estar ativo.',
// 				path: [firstSlot, 'amount'],
// 			});
// 		}
// 	});

// export const servicesSchema = escortProfileSchema.pick({
// 	services: true,
// });

// export const gallerySchema = escortProfileSchema.pick({
// 	gallery: true,
// });

// export function isInformationComplete(profile: ProfileSelect): boolean {
// 	return informationSchema.safeParse(profile).success;
// }

// export function isLocationComplete(profile: ProfileSelect): boolean {
// 	return locationSchema.safeParse(profile).success;
// }

// export function isCharacteristicsComplete(profile: ProfileSelect): boolean {
// 	return characteristicsSchema.safeParse({
// 		characteristics: profile.characteristics,
// 	}).success;
// }

// export function isOfficeHoursComplete(profile: ProfileSelect): boolean {
// 	const items = Array.isArray(profile.office_hours) ? profile.office_hours : [];
// 	return items.some((it) => {
// 		if (!it?.is_available) return false;
// 		const s = (it?.start ?? '').trim();
// 		const e = (it?.end ?? '').trim();
// 		if (!/^\d{2}:\d{2}$/.test(s) || !/^\d{2}:\d{2}$/.test(e)) return false;
// 		return s < e;
// 	});
// }

// export function isPricesComplete(profile: ProfileSelect): boolean {
// 	const prices = Array.isArray(profile.prices) ? profile.prices : [];
// 	return prices.some(
// 		(p) =>
// 			Boolean(p?.is_available) &&
// 			((p?.amount ?? 0) >= 40 || Boolean(p?.negotiated)),
// 	);
// }

// export function isServicesComplete(profile: ProfileSelect): boolean {
// 	const services = Array.isArray(profile.services) ? profile.services : [];
// 	return services.length > 5;
// }

// export function getServicesProgress(profile: ProfileSelect): {
// 	count: number;
// 	isComplete: boolean;
// 	hasPartialProgress: boolean;
// } {
// 	const services = Array.isArray(profile.services) ? profile.services : [];
// 	const count = services.length;
// 	const isComplete = count > 5;
// 	const hasPartialProgress = count > 0 && count <= 5;

// 	return {
// 		count,
// 		isComplete,
// 		hasPartialProgress,
// 	};
// }

// export function isGalleryComplete(
// 	profile: ProfileSelect,
// 	minPhotos = 5,
// ): boolean {
// 	const gallery = Array.isArray(profile.gallery) ? profile.gallery : [];
// 	const validPhotos = gallery.filter(
// 		(g) => typeof g?.url === 'string' && g.url.length > 0,
// 	);
// 	return validPhotos.length >= minPhotos;
// }

// export function getGalleryProgress(profile: ProfileSelect): {
// 	count: number;
// 	isComplete: boolean;
// 	hasPartialProgress: boolean;
// } {
// 	const gallery = Array.isArray(profile.gallery) ? profile.gallery : [];
// 	const validPhotos = gallery.filter(
// 		(g) => typeof g?.url === 'string' && g.url.length > 0,
// 	);
// 	const count = validPhotos.length;
// 	const isComplete = count >= 5;
// 	const hasPartialProgress = count > 0 && count < 5;

// 	return {
// 		count,
// 		isComplete,
// 		hasPartialProgress,
// 	};
// }

// export function computeOnboardingCompletion(profile: ProfileSelect): boolean[] {
// 	return [
// 		isInformationComplete(profile),
// 		isLocationComplete(profile),
// 		isCharacteristicsComplete(profile),
// 		isOfficeHoursComplete(profile),
// 		isPricesComplete(profile),
// 		isServicesComplete(profile),
// 		isGalleryComplete(profile),
// 	];
// }
