import { z } from 'zod';

export const countrySchema = z.enum(['portugal']);

export const escortSlugSchema = z
	.string()
	.min(3, 'Slug muito curto')
	.max(100, 'Slug muito longo')
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		'Slug deve conter apenas letras minúsculas, números e hífens (sem hífens no início ou fim)',
	);

export const escortParamsSchema = {
	country: countrySchema,
	slug: escortSlugSchema,
};

export type EscortParams = {
	country: z.infer<typeof countrySchema>;
	slug: z.infer<typeof escortSlugSchema>;
};
