import { useMemo } from 'react';
import { getTranslation, interpolate } from '@/i18n';
import type { DeepKeys, TranslationKey } from '@/i18n/types';
import { useLocale } from './useLocale';

export function useTranslation() {
	const { locale } = useLocale();
	const translations = useMemo(() => getTranslation(locale), [locale]);

	// Get nested translation value
	const t = <K extends DeepKeys<TranslationKey>>(
		key: K,
		params?: Record<string, string | number>,
	): string => {
		const keys = key.split('.');
		let value: any = translations;

		for (const k of keys) {
			if (value && typeof value === 'object' && k in value) {
				value = value[k];
			} else {
				console.warn(`Translation key not found: ${key}`);
				return key;
			}
		}

		if (typeof value !== 'string') {
			console.warn(`Translation value is not a string: ${key}`);
			return key;
		}

		return params ? interpolate(value, params) : value;
	};

	return { t, locale, translations };
}
