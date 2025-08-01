import {
	type NavigateOptions,
	useNavigate,
	useParams,
} from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import {
	defaultLocale,
	type Locale,
	type LocaleConfig,
	supportedLocales,
} from '@/i18n/types';

interface UseLocaleReturn extends LocaleConfig {
	navigateWithLocale: (to: string, options?: NavigateOptions) => void;
	switchLocale: (newLocale: Locale) => void;
	formatUrl: (path: string) => string;
}

export function useLocale(): UseLocaleReturn {
	const navigate = useNavigate();
	const params = useParams({ from: '/{-$locale}' });

	// Get locale from params or use default
	const locale = (params.locale || defaultLocale) as Locale;
	const isDefaultLocale = locale === defaultLocale;

	// Navigate preserving locale
	const navigateWithLocale = useCallback(
		(to: string, options?: NavigateOptions) => {
			// Remove leading slash if present
			const cleanPath = to.startsWith('/') ? to.slice(1) : to;

			// Build path with locale prefix for non-default locales
			const targetPath = isDefaultLocale
				? `/${cleanPath}`
				: `/${locale}/${cleanPath}`;

			navigate({ href: targetPath, ...options });
		},
		[navigate, locale, isDefaultLocale],
	);

	// Switch to a different locale
	const switchLocale = useCallback(
		(newLocale: Locale) => {
			const currentPath = window.location.pathname;
			let newPath: string;

			// Remove current locale prefix if exists
			const pathWithoutLocale = supportedLocales.reduce((path, loc) => {
				const prefix = `/${loc}/`;
				if (path.startsWith(prefix)) {
					return path.slice(prefix.length - 1);
				}
				return path;
			}, currentPath);

			// Add new locale prefix if not default
			if (newLocale === defaultLocale) {
				newPath = pathWithoutLocale;
			} else {
				newPath = `/${newLocale}${pathWithoutLocale}`;
			}

			navigate({ to: newPath, search: window.location.search });
		},
		[navigate, defaultLocale, supportedLocales],
	);

	// Format URL with proper locale prefix
	const formatUrl = useCallback(
		(path: string): string => {
			const cleanPath = path.startsWith('/') ? path : `/${path}`;
			return isDefaultLocale ? cleanPath : `/${locale}${cleanPath}`;
		},
		[locale, isDefaultLocale],
	);

	return useMemo(
		() => ({
			locale,
			isDefaultLocale,
			supportedLocales,
			defaultLocale,
			navigateWithLocale,
			switchLocale,
			formatUrl,
		}),
		[
			locale,
			isDefaultLocale,
			supportedLocales,
			defaultLocale,
			navigateWithLocale,
			switchLocale,
			formatUrl,
		],
	);
}
