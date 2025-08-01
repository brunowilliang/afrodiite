import { en } from './translations/en';
import { es } from './translations/es';
import { pt } from './translations/pt';
import type { AllTranslations, Locale } from './types';

// Translation map
export const translations = {
	pt,
	en,
	es,
} as const;

// Get translation function
export function getTranslation(locale: Locale): AllTranslations {
	return translations[locale] || translations.pt;
}

// Simple template replacement for translations with variables
export function interpolate(
	text: string,
	params: Record<string, string | number>,
): string {
	return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
		return params[key]?.toString() || match;
	});
}
