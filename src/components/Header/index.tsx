import { headers as nextHeaders } from 'next/headers';
import { IProfile } from '@/api/utils/schemas/escort-forms';
import { auth } from '@/lib/auth/server';
import { api } from '@/lib/orpc';
import { tryCatch } from '@/utils/tryCatch';
import { Header as HeaderComponent } from '../core/Header';

export async function Header() {
	const headers = await nextHeaders();

	const [, session] = await tryCatch(auth.api.getSession({ headers }));

	const profile = session
		? ((await api.orpc.profile.get()) as IProfile.Select | undefined)
		: undefined;

	return <HeaderComponent profile={profile} />;
}
