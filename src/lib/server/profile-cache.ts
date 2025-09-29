'use server';

import { unstable_cacheTag as cacheTag } from 'next/cache';
import { createContext } from '@/api/http/context/session';
import { profile } from '@/api/http/routes/profile';
import { IProfile } from '@/api/utils/schemas/escort-forms';

export async function getProfile() {
	const context = await createContext();

	if (!context.session) return undefined;

	// Função interna com cache recebendo parâmetro
	async function cachedProfile() {
		'use cache';
		cacheTag('profile');

		if (!context.session) return undefined;

		const result = await profile.findOne({ id: context.session.user.id });
		return result as IProfile.Select | undefined;
	}

	return cachedProfile();
}
