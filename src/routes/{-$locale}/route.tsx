import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useMemo } from 'react';
import { NotFound } from '@/components/NotFound';
import i18n from '@/i18n';
import { localeSchema, validateLocale } from '@/utils/validators/locale';

export const Route = createFileRoute('/{-$locale}')({
	params: localeSchema,
	beforeLoad: ({ params }) => ({ locale: params.locale }),
	errorComponent: () => <NotFound />,
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
