import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';
import { createCrud } from '@/api/database';
import { testeTable } from '@/api/database/schemas';
import { publicProcedure } from '../middlewares';

const teste = createCrud(testeTable, {});

export const insertSchema = createInsertSchema(testeTable);
export const updateSchema = createUpdateSchema(testeTable, {
	id: z.coerce.number(),
});

export const testeRoutes = {
	create: publicProcedure.input(insertSchema).handler(async ({ input }) => {
		const result = await teste.create(input);
		return result;
	}),
	list: publicProcedure.handler(async () => {
		const result = await teste.list({});
		return result;
	}),
	update: publicProcedure.input(updateSchema).handler(async ({ input }) => {
		const result = await teste.update(input.id, input);
		return result;
	}),
};
