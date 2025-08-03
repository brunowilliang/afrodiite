import { z } from 'zod';

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
