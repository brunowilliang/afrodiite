// Centralized i18n type definitions

// 1. Locale definitions
export const supportedLocales = ['en', 'es'] as const;
export const defaultLocale = 'pt' as const;
export const allLocales = [defaultLocale, ...supportedLocales] as const;

// 2. Locale types
export type SupportedLocale = (typeof supportedLocales)[number];
export type Locale = SupportedLocale | typeof defaultLocale;

// 3. Translation types (based on pt as the base)
import type { pt } from './translations/pt';
export type TranslationKey = typeof pt;
export type AllTranslations =
	| typeof import('./translations/pt').pt
	| typeof import('./translations/en').en
	| typeof import('./translations/es').es;

// 4. Locale validation
export function validateLocale(locale: string | undefined): locale is Locale {
	return allLocales.includes(locale as Locale);
}

// 5. Interface for router context
export interface LocaleRouterContext {
	request?: Request;
}

// 6. Interface for locale configuration
export interface LocaleConfig {
	locale: Locale;
	isDefaultLocale: boolean;
	supportedLocales: readonly Locale[];
	defaultLocale: Locale;
}

// 7. Type utilities for deep translation keys
export type DeepKeys<T> = T extends object
	? {
			[K in keyof T]: K extends string
				? T[K] extends object
					? `${K}.${DeepKeys<T[K]>}` | K
					: K
				: never;
		}[keyof T]
	: never;
