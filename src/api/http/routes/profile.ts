import { createCrud } from '@/api/database';
import { escortProfiles } from '@/api/database/schemas';
import { authProcedure } from '@/api/http/middlewares';
import { profileUpdateSchema } from '@/api/utils/schemas/escort-forms';

export const profile = createCrud(escortProfiles);

export const profileRoutes = {
	get: authProcedure.handler(async ({ context }) => {
		const result = await profile.findOne({ id: context.session.user.id });
		return result;
	}),
	update: authProcedure
		.input(profileUpdateSchema)
		.handler(async ({ context, input }) => {
			const result = await profile.update(context.session.user.id, input);
			return result;
		}),
};
