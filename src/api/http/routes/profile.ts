import { eq } from 'drizzle-orm';
import { db } from '@/api/db';
import { escortProfiles } from '@/api/db/schemas';
import { profileUpdateSchema } from '@/api/utils/types/escort';
import { authProcedure, publicProcedure } from '../middlewares/auth';

export const profileRoutes = {
	get: authProcedure.handler(async ({ context }) => {
		return await db
			.select()
			.from(escortProfiles)
			.where(eq(escortProfiles.id, context.session.user.id))
			.limit(1)
			.then(([profile]) => profile);
	}),
	update: authProcedure
		.input(profileUpdateSchema)
		.handler(async ({ context, input }) => {
			return await db
				.update(escortProfiles)
				.set(input)
				.where(eq(escortProfiles.id, context.session.user.id));
		}),
	list: publicProcedure.handler(async () => {
		return await db.select().from(escortProfiles).limit(10);
	}),
};
