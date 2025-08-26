import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useMemo } from 'react';
import z from 'zod';
import { NotFound } from '@/components/NotFound';
import i18n from '@/i18n';

export const localeSchema = z.object({
	locale: z
		.enum(['pt', 'en', 'es'], {
			message: 'Invalid locale',
		})
		.optional(),
});

export type Locale = z.infer<typeof localeSchema>['locale'];

export const validateLocale = (
	locale: string | null | undefined,
): locale is Locale => {
	return localeSchema.safeParse({ locale }).success;
};

export const Route = createFileRoute('/{-$locale}')({
	params: localeSchema,
	beforeLoad: async ({ params }) => ({ locale: params.locale }),
	component: () => {
		const { locale } = Route.useParams();

		const defaultLocale = locale || 'pt';
		const isValidLocale = !locale || validateLocale(locale);

		useMemo(() => {
			if (isValidLocale) {
				if (i18n.language !== defaultLocale) {
					i18n.changeLanguage(defaultLocale);
				}
			}
		}, [locale, isValidLocale]);

		return <Outlet />;
	},
});
