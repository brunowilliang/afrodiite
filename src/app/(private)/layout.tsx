import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';
import { Card } from '@/components/core/Card';
import { MenuTabs } from '@/components/Header/Menu';
import { api } from '@/lib/orpc';

type Props = Readonly<{
	children: React.ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
	const queryClient = new QueryClient();
	await queryClient.ensureQueryData(api.queries.reviews.list.queryOptions());
	await queryClient.ensureQueryData(api.queries.profile.get.queryOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<section className="mx-auto grid w-full max-w-5xl grid-cols-12 gap-5 overflow-visible py-4">
				<div className="hidden md:col-span-3 md:block">
					<MenuTabs isAuthenticated />
				</div>

				<Card
					className="col-span-full min-h-[calc(100vh-100px-20px)] overflow-visible bg-default-50 p-4 md:col-span-9"
					shadow="none"
				>
					{children}
				</Card>
			</section>
		</HydrationBoundary>
	);
}
