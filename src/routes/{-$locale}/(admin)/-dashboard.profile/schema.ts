import {
	characteristicsZ,
	informationZ,
	locationZ,
	officeHoursByDayZ,
	pricesBySlotZ,
} from '@/api/utils/schemas/escort';
import type { ProfileSelect } from '@/api/utils/types/escort';

export const informationSchema = informationZ;
export const locationSchema = locationZ;
export const characteristicsSchema = characteristicsZ;
export const officeHoursSchema = officeHoursByDayZ;
export const pricesSchema = pricesBySlotZ;

export function isInformationComplete(profile: ProfileSelect): boolean {
	return informationSchema.safeParse(profile).success;
}

export function isLocationComplete(profile: ProfileSelect): boolean {
	return locationSchema.safeParse(profile).success;
}

export function isCharacteristicsComplete(profile: ProfileSelect): boolean {
	return characteristicsSchema.safeParse(profile.characteristics ?? {}).success;
}

export function isOfficeHoursComplete(profile: ProfileSelect): boolean {
	const items = Array.isArray(profile.office_hours) ? profile.office_hours : [];
	return items.some((it) => {
		if (!it?.is_available) return false;
		const s = (it?.start ?? '').trim();
		const e = (it?.end ?? '').trim();
		if (!/^\d{2}:\d{2}$/.test(s) || !/^\d{2}:\d{2}$/.test(e)) return false;
		return s < e;
	});
}

export function isPricesComplete(profile: ProfileSelect): boolean {
	const prices = Array.isArray(profile.prices) ? profile.prices : [];
	return prices.some((p) => Boolean(p?.is_available) && (p?.amount ?? 0) > 0);
}

export function isServicesComplete(profile: ProfileSelect): boolean {
	const sv = profile.services as unknown;
	if (!Array.isArray(sv) || (sv as unknown[]).length === 0) return false;
	if (typeof (sv as unknown[])[0] === 'number')
		return ((sv as number[]) ?? []).length > 0;
	return (sv as Array<{ id: number; is_available?: boolean }>).some(
		(s) => !!s?.is_available,
	);
}

export function isGalleryComplete(
	profile: ProfileSelect,
	minPhotos = 5,
): boolean {
	const gallery = Array.isArray(profile.gallery) ? profile.gallery : [];
	const valid = gallery.filter(
		(g) => typeof g?.url === 'string' && g.url.length > 0,
	);
	return valid.length >= minPhotos;
}

export function computeOnboardingCompletion(profile: ProfileSelect): boolean[] {
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
