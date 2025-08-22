import { Chip, Pagination } from '@heroui/react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { useState } from 'react';
import z from 'zod';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { EscortCard } from '@/components/escorts/Card';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
import { api } from '@/lib/api';

export const Route = createFileRoute('/{-$locale}/(public)/escorts/$country/')({
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
		name: z.string().optional(),
		district: z.string().optional(),
		zone: z.string().optional(),
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(
			api.queries.profile.list.queryOptions({
				input: deps,
			}),
		);
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const search = Route.useSearch();
	const [typedName, setTypedName] = useState<string>(search.name ?? '');

	const { data } = useSuspenseQuery(
		api.queries.profile.list.queryOptions({
			input: search,
		}),
	);

	const { data: filters } = useQuery(
		api.queries.profile.filters.queryOptions({
			input: { district: search.district },
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

				<Stack className="centered gap-2">
					<Input
						label="Pesquise por nome"
						isClearable
						value={typedName}
						onChange={(e) => setTypedName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								navigate({
									search: (prev) => ({
										...prev,
										page: 1,
										name: typedName || undefined,
									}),
								});
							}
						}}
						onClear={() => {
							setTypedName('');
							navigate({
								search: (prev) => ({ ...prev, page: 1, name: undefined }),
							});
						}}
					/>
					<Stack className="w-full flex-row gap-2">
						<Input.AutoComplete
							label="Por distrito"
							selectedKey={search.district ?? null}
							onSelectionChange={(key) => {
								navigate({
									search: (prev) => ({
										...prev,
										page: 1,
										district: (key as string) || undefined,
										zone: undefined,
									}),
								});
							}}
						>
							{(filters?.districts ?? []).map((d) => (
								<Input.AutoComplete.Item
									key={d.name ?? ''}
									textValue={d.name ?? ''}
								>
									{d.name} ({d.count})
								</Input.AutoComplete.Item>
							))}
						</Input.AutoComplete>
						<Input.AutoComplete
							label="Por zona"
							selectedKey={search.zone ?? null}
							onSelectionChange={(key) => {
								navigate({
									search: (prev) => ({
										...prev,
										page: 1,
										zone: (key as string) || undefined,
									}),
								});
							}}
						>
							{(filters?.zones ?? []).map((z) => (
								<Input.AutoComplete.Item
									key={z.name ?? ''}
									textValue={z.name ?? ''}
								>
									{z.name} ({z.count})
								</Input.AutoComplete.Item>
							))}
						</Input.AutoComplete>
					</Stack>

					<Stack className="w-full flex-row items-center justify-between">
						<Button
							size="md"
							variant="light"
							onClick={() => {
								navigate({ search: {} });
								setTypedName('');
							}}
						>
							Remover filtros
						</Button>
						<Button
							size="md"
							onClick={() => {
								navigate({
									search: (prev) => ({
										...prev,
										page: 1,
										name: typedName || undefined,
									}),
								});
							}}
						>
							Pesquisar
						</Button>
					</Stack>
				</Stack>

				{/* Resultados e filtros ativos */}
				<div className="flex flex-wrap gap-1">
					<Text>Filtros ativos:</Text>
					{Object.entries(search)
						.filter(([key]) => key !== 'page')
						.map(([key, value]) => {
							const labelMap: Record<string, string> = {
								name: 'Nome',
								district: 'Distrito',
								zone: 'Zona',
							};
							const label = labelMap[key] ?? key;
							return (
								<Chip
									key={key}
									color="primary"
									variant="flat"
									onClose={() => {
										navigate({
											search: (prev) => ({
												...prev,
												[key]: undefined,
												...(key === 'district' ? { zone: undefined } : {}),
											}),
										});
										if (key === 'name') setTypedName('');
									}}
								>
									{label}: {String(value)}
								</Chip>
							);
						})}
				</div>

				{/* {isFetching && <Spinner variant="gradient" title="Carregando..." />} */}

				{/* Grid de 4 colunas */}
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
					{data?.data.map((profile) => (
						<EscortCard
							key={profile.id}
							profile={profile as any}
							onClick={() => {
								console.log('Navigate to', profile.slug);
								navigate({
									to: '/{-$locale}/escorts/$country/$slug',
									params: {
										country: 'portugal',
										slug: profile.slug ?? '',
									},
								});
							}}
						/>
					))}
				</div>
			</Stack>

			<Stack className="centered py-6">
				{/* Paginação */}
				{data && data.pagination.totalPages > 1 && (
					<Pagination
						total={data.pagination.totalPages}
						page={data.pagination.page}
						showControls
						onChange={(page) => {
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
