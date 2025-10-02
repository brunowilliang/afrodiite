import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';
import { api } from '@/lib/orpc';

type Props = Readonly<{
	children: React.ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
	// const session = await api.orpc.session();
	const queryClient = new QueryClient();
	await queryClient.ensureQueryData(api.queries.reviews.list.queryOptions());
	await queryClient.ensureQueryData(api.queries.profile.get.queryOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{children}
		</HydrationBoundary>
	);
}
