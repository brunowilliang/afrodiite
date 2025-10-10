import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import { api } from '@/lib/orpc';
import { generateListingMetadata } from '@/lib/seo/metadata';
import PortugalIndex from '.';
import { loadParams } from './searchParams';

export async function generateMetadata(
	props: PageProps<'/portugal'>,
): Promise<Metadata> {
	const { search } = await loadParams(props.searchParams);
	return generateListingMetadata(search);
}

export default async function Page(props: PageProps<'/portugal'>) {
	const { page, search } = await loadParams(props.searchParams);

	const queryClient = new QueryClient();
	await queryClient.ensureQueryData(
		api.queries.escorts.list.queryOptions({
			input: { page, search },
		}),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PortugalIndex />
		</HydrationBoundary>
	);
}
