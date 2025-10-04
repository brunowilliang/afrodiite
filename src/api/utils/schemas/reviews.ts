import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { escortReviews } from '@/api/database/schemas/reviews';

export const schema = createInsertSchema(escortReviews, {
	escort_id: z.string().min(1, 'o id da escort é obrigatório'),
	public_id: z.number().min(1, 'o id público é obrigatório'),
	rating: z
		.number()
		.min(1, 'o mínimo de rating é 1')
		.max(5, 'o máximo de rating é 5'),
	reviewer_name: z.string().min(1, 'o nome é obrigatório'),
	reviewer_email: z.email('o email é inválido').optional(),
	reviewer_phone: z.string().optional(),
	title: z
		.string()
		.min(1, 'o título é obrigatório')
		.max(100, 'o título deve ter no máximo 100 caracteres'),
	comment: z
		.string()
		.min(1, 'o comentário é obrigatório')
		.max(1000, 'o comentário deve ter no máximo 1000 caracteres'),
});

export const ReviewSchema = {
	input: schema,
	output: schema.omit({ escort_id: true, public_id: true }),
};

export namespace IReviews {
	export type Input = z.infer<typeof ReviewSchema.input>;
	export type Output = z.infer<typeof ReviewSchema.output>;
	export type List = {
		results: IReviews.Output[];
	};
}
