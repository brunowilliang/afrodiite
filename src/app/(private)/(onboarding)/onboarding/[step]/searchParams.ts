import { z } from 'zod';

export const stepEnum = z.enum([
	'informacoes',
	'localizacao',
	'caracteristicas',
	'horarios',
	'precos',
	'servicos',
	'galeria',
]);

export type Step = z.infer<typeof stepEnum>;

export const isValidStep = (step: string): step is Step => {
	return stepEnum.safeParse(step).success;
};
