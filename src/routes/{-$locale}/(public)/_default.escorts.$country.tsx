import { Chip, Pagination } from '@heroui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { useState } from 'react';
import z from 'zod';
import { Icon } from '@/components/core/Icon';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { EscortCard } from '@/components/escorts/Card';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
import { api } from '@/lib/api';

export const Route = createFileRoute(
	'/{-$locale}/(public)/_default/escorts/$country',
)({
	component: RouteComponent,
	beforeLoad: async ({ params }) => {
		const { country } = params;

		if (country !== 'portugal') {
			throw notFound();
		}
	},
	params: z.object({
		country: z.enum(['portugal']),
	}),
	validateSearch: z.object({
		page: z.number().default(1),
		search: z.string().optional(),
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(
			api.queries.escorts.list.queryOptions({
				input: deps,
			}),
		);
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const search = Route.useSearch();
	const [typedSearch, setTypedSearch] = useState<string>(search.search ?? '');

	const { data } = useSuspenseQuery(
		api.queries.escorts.list.queryOptions({
			input: {
				page: search.page,
				search: search.search,
			},
		}),
	);

	return (
		<Container className="py-20">
			<Stack className="gap-6">
				<Stack className="centered gap-1 py-5 text-center">
					<Chip variant="bordered" color="default">
						Encontre
					</Chip>
					<h1 className="mt-2 font-semibold text-3xl text-default-800">
						Escorts em Portugal
					</h1>
					<p className="text-default-600">
						Descubra as melhores acompanhantes em todo o país
					</p>
				</Stack>

				<Stack direction="row" className="centered gap-2">
					<Input
						label="Busque por nome, distrito ou cidade..."
						isClearable
						value={typedSearch}
						onChange={(e) => setTypedSearch(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								navigate({
									search: (prev) => ({
										...prev,
										page: 1,
										search: typedSearch || undefined,
									}),
								});
							}
						}}
						onClear={() => {
							setTypedSearch('');
							navigate({
								search: (prev) => ({ ...prev, page: 1, search: undefined }),
							});
						}}
					/>
					<Button
						className="min-h-[56px] min-w-[56px]"
						color="default"
						onClick={() => {
							navigate({
								search: (prev) => ({
									...prev,
									page: 1,
									search: typedSearch || undefined,
								}),
							});
						}}
					>
						<Icon name="Search" variant="solid" size="20" />
					</Button>
				</Stack>

				{/* Resultados e filtros ativos */}
				{search.search && (
					<div className="flex flex-wrap gap-1">
						<Text>Filtros ativos:</Text>
						<Chip
							color="primary"
							variant="flat"
							onClose={() => {
								navigate({
									search: (prev) => ({
										...prev,
										search: undefined,
									}),
								});
								setTypedSearch('');
							}}
						>
							Busca: {search.search}
						</Chip>
					</div>
				)}

				{/* {isFetching && <Spinner variant="gradient" title="Carregando..." />} */}

				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
					{data?.results?.map((profile) => {
						return <EscortCard key={profile.id} profile={profile as any} />;
					})}
				</div>
			</Stack>

			<Stack className="centered py-6">
				{data && data.totalPages > 1 && (
					<Pagination
						total={data.totalPages}
						page={data.page}
						showControls
						onChange={(page: number) => {
							navigate({
								search: (prev) => ({ ...prev, page }),
							});
						}}
					/>
				)}
			</Stack>
		</Container>
	);
}
