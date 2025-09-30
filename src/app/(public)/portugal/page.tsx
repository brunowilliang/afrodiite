import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';
import { api } from '@/lib/orpc';
import PortugalIndex from '.';
import { loadParams } from './searchParams';

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
