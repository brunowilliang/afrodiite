import { notFound } from 'next/navigation';
import { IProfile } from '@/api/utils/schemas/escort-forms';
import { api } from '@/lib/orpc';
import { EscortPage } from './components/Page';

export default async function EscortProfilePage(
	props: PageProps<'/acompanhante/[public_id]/[slug]'>,
) {
	const { params } = props;
	const { public_id, slug } = await params;
	const publicId = Number(public_id);

	// Validate public_id is a number
	if (Number.isNaN(publicId)) {
		notFound();
	}

	try {
		// Fetch escort profile
		const profile = await api.orpc.escorts.detail({ public_id: publicId });

		// Check if profile exists and is visible
		if (!profile || !profile.is_visible || !profile.is_onboarding_complete) {
			notFound();
		}

		// Verify slug matches
		if (profile.slug !== slug) {
			notFound();
		}

		return <EscortPage profile={profile as IProfile.Select} />;
	} catch (error) {
		console.error('Error fetching escort profile:', error);
		notFound();
	}
}
