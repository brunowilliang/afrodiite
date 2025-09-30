import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';
import { api } from '@/lib/orpc';
import { Header as HeaderComponent } from '../core/Header';

export async function Header() {
	const session = await api.orpc.session();

	if (!session?.session) {
		return <HeaderComponent isAuthenticated={false} />;
	}

	const queryClient = new QueryClient();
	await queryClient.ensureQueryData(api.queries.profile.get.queryOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<HeaderComponent isAuthenticated />
		</HydrationBoundary>
	);
}
