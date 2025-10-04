import { IProfile } from '@/api/utils/schemas/escort-forms';
import { CaracteristicasSchema } from '@/app/(private)/(painel)/perfil/caracteristicas/Caracteristicas';
import { HorariosSchema } from '@/app/(private)/(painel)/perfil/horarios/Horarios';
import { InformacoesSchema } from '@/app/(private)/(painel)/perfil/Informacoes';
import { LocalizacaoSchema } from '@/app/(private)/(painel)/perfil/localizacao/Localizacao';
import { PrecosSchema } from '@/app/(private)/(painel)/perfil/precos/Precos';

// Validation functions
export function isInformacoesComplete(profile: IProfile.Select): boolean {
	return InformacoesSchema.safeParse(profile).success;
}

export function isLocalizacaoComplete(profile: IProfile.Select): boolean {
	return LocalizacaoSchema.safeParse(profile).success;
}

export function isCaracteristicasComplete(profile: IProfile.Select): boolean {
	return CaracteristicasSchema.safeParse(profile).success;
}

export function isHorariosComplete(profile: IProfile.Select): boolean {
	const officeHours = Array.isArray(profile.office_hours)
		? profile.office_hours
		: [];

	// Convert array to object format expected by HorariosSchema
	const hoursObj = Object.fromEntries(
		officeHours.map((h) => [
			h.day,
			{ is_available: h.is_available, start: h.start, end: h.end },
		]),
	);

	return HorariosSchema.safeParse(hoursObj).success;
}

export function isPrecosComplete(profile: IProfile.Select): boolean {
	const prices = Array.isArray(profile.prices) ? profile.prices : [];

	// Convert array to object format expected by PrecosSchema
	const pricesObj = Object.fromEntries(
		prices.map((p) => [
			p.slot,
			{
				is_available: p.is_available,
				amount: p.amount,
				negotiated: p.negotiated,
				currency: p.currency,
			},
		]),
	);

	return PrecosSchema.safeParse(pricesObj).success;
}

export function getServicosStatus(profile: IProfile.Select) {
	const services = Array.isArray(profile.services) ? profile.services : [];
	const count = services.length;
	const isComplete = count >= 5;
	const hasPartialProgress = count > 0 && count < 5;

	return { isComplete, hasPartialProgress, count };
}

export function getGaleriaStatus(profile: IProfile.Select) {
	const gallery = Array.isArray(profile.gallery) ? profile.gallery : [];
	const validPhotos = gallery.filter(
		(g) => typeof g?.url === 'string' && g.url.length > 0,
	);
	const count = validPhotos.length;
	const isComplete = count >= 5;
	const hasPartialProgress = count > 0 && count < 5;

	return { isComplete, hasPartialProgress, count };
}

export function computeOnboardingCompletion(
	profile: IProfile.Select,
): boolean[] {
	return [
		isInformacoesComplete(profile),
		isLocalizacaoComplete(profile),
		isCaracteristicasComplete(profile),
		isHorariosComplete(profile),
		isPrecosComplete(profile),
		getServicosStatus(profile).isComplete,
		getGaleriaStatus(profile).isComplete,
	];
}

export function getOnboardingStatus(profile: IProfile.Select) {
	return {
		informacoes: {
			isComplete: isInformacoesComplete(profile),
			hasPartialProgress: false,
		},
		localizacao: {
			isComplete: isLocalizacaoComplete(profile),
			hasPartialProgress: false,
		},
		caracteristicas: {
			isComplete: isCaracteristicasComplete(profile),
			hasPartialProgress: false,
		},
		horarios: {
			isComplete: isHorariosComplete(profile),
			hasPartialProgress: false,
		},
		precos: {
			isComplete: isPrecosComplete(profile),
			hasPartialProgress: false,
		},
		servicos: getServicosStatus(profile),
		galeria: getGaleriaStatus(profile),
	};
}
