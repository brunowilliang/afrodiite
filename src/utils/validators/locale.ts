import { z } from 'zod';

export const localeSchema = z.object({
	locale: z.enum(['pt', 'en', 'es']).optional(),
});

export type Locale = z.infer<typeof localeSchema>['locale'];

export const validateLocale = (locale: Locale) => {
	return localeSchema.safeParse({ locale }).success;
};
