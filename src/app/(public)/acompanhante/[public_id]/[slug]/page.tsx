import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { api } from '@/lib/orpc';
import { AcompanhanteIndex } from '.';

export default async function AcompanhantePage(
	props: PageProps<'/acompanhante/[public_id]/[slug]'>,
) {
	const { public_id, slug } = await props.params;

	const queryClient = new QueryClient();

	try {
		const profile = await queryClient.ensureQueryData(
			api.queries.escorts.detail.queryOptions({
				input: { public_id },
			}),
		);

		if (!profile || !profile.is_visible || !profile.is_onboarding_complete) {
			notFound();
		}

		if (profile.slug !== slug) {
			notFound();
		}

		return (
			<HydrationBoundary state={dehydrate(queryClient)}>
				<AcompanhanteIndex publicId={public_id} />
			</HydrationBoundary>
		);
	} catch (error) {
		console.error('Error fetching escort profile:', error);
		notFound();
	}
}
