'use server';

import { ORPCError, os } from '@orpc/server';
import { revalidateTag } from 'next/cache';
import { createContext } from '@/api/http/context/session';
import { profile } from '@/api/http/routes/profile';
import { profileUpdateSchema } from '@/api/utils/schemas/escort-forms';

export const updateProfile = os
	.input(profileUpdateSchema)
	.handler(async ({ input }) => {
		const context = await createContext();

		if (!context.session) {
			throw new ORPCError('UNAUTHORIZED');
		}

		const result = await profile.update(context.session.user.id, input);
		revalidateTag('profile');
		return result;
	})
	.actionable({
		context: async () => ({}),
	});
