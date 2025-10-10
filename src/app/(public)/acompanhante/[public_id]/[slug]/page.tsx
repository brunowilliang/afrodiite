import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { api } from '@/lib/orpc';
import {
	generateProfileJsonLd,
	generateProfileMetadata,
} from '@/lib/seo/metadata';
import { Acompanhante } from './Acompanhante';

export async function generateMetadata(
	props: PageProps<'/acompanhante/[public_id]/[slug]'>,
): Promise<Metadata> {
	const { public_id, slug } = await props.params;

	try {
		const profile = await api.orpc.escorts.detail({ public_id });

		if (!profile || !profile.is_visible || !profile.is_onboarding_complete) {
			return {};
		}

		if (profile.slug !== slug) {
			return {};
		}

		return generateProfileMetadata(profile);
	} catch {
		return {};
	}
}

export default async function Page(
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

		const reviews = await queryClient.ensureQueryData(
			api.queries.escorts.reviews.queryOptions({
				input: { public_id },
			}),
		);

		if (!profile || !profile.is_visible || !profile.is_onboarding_complete) {
			notFound();
		}

		if (profile.slug !== slug) {
			notFound();
		}

		const jsonLd = generateProfileJsonLd(profile, reviews.results);

		return (
			<>
				<Script
					id="profile-jsonld"
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Acompanhante publicId={public_id} />
				</HydrationBoundary>
			</>
		);
	} catch (error) {
		console.error('Error fetching escort profile:', error);
		notFound();
	}
}
