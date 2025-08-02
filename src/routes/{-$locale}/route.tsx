import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';
import { useMemo } from 'react';
import i18n from '@/i18n';
import { localeSchema, validateLocale } from '@/utils/validators/locale';

export const Route = createFileRoute('/{-$locale}')({
	params: localeSchema,
	beforeLoad: ({ params }) => {
		const { locale } = params;

		if (locale && !validateLocale(locale)) {
			throw notFound();
		}

		return { locale };
	},
	component: () => {
		const { locale } = Route.useParams();

		useMemo(() => {
			const targetLocale = locale || 'pt';
			if (i18n.language !== targetLocale) {
				i18n.changeLanguage(targetLocale);
			}
		}, [locale]);

		return <Outlet />;
	},
});
