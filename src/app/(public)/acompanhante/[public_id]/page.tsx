import { notFound, redirect } from 'next/navigation';
import { api } from '@/lib/orpc';
import { tryCatch } from '@/utils/tryCatch';

export default async function RedirectPage(
	props: PageProps<'/acompanhante/[public_id]'>,
) {
	const { params } = await props;
	const { public_id } = await params;
	const publicId = Number(public_id);

	// Validate public_id is a number
	if (Number.isNaN(publicId)) {
		notFound();
	}

	// Fetch escort profile using tryCatch
	const [error, profile] = await tryCatch(
		api.orpc.escorts.detail({ public_id: publicId }),
	);

	if (error) {
		console.error('Error fetching escort profile:', error);
		notFound();
	}

	// Check if profile exists and is visible
	if (!profile || !profile.is_visible || !profile.is_onboarding_complete) {
		notFound();
	}

	// Use the saved slug from database
	if (!profile.slug) {
		notFound();
	}

	// Debug: Show the data
	console.log('🚀 Fetch success! public_id:', publicId, 'slug:', profile.slug);

	// Redirect to final URL (outside tryCatch to avoid catching NEXT_REDIRECT)
	redirect(`/acompanhante/${publicId}/${profile.slug}`);
}
