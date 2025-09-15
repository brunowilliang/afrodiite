import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useMemo } from 'react';
import z from 'zod';
import i18n from '@/i18n';
import { api } from '@/lib/api';
import { tryCatch } from '@/utils/tryCatch';

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
	loader: async ({ context }) => {
		if (context.session) {
			const [profileError, profile] = await tryCatch(api.client.profile.get());

			if (profileError) {
				console.warn('Profile error in locale loader:', profileError.message);
				return { profile: null };
			}

			return { profile };
		}

		return { profile: null };
	},
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
