'use client';

import { Chip, Pagination } from '@heroui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useState } from 'react';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { Icon } from '@/components/core/Icon';
import { Input } from '@/components/core/Input';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/orpc';
import { EscortCard } from './components/card';
import { searchParams } from './searchParams';

export const dynamic = 'force-dynamic';

export default function PortugalIndex() {
	const [{ page, search }, setParams] = useQueryStates(searchParams);
	const [typedSearch, setTypedSearch] = useState(search);

	const { data } = useSuspenseQuery(
		api.queries.escorts.list.queryOptions({
			input: { page, search },
		}),
	);

	return (
		<div>
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
								// ✅ nuqs - Atualiza URL automaticamente
								setParams({ page: 1, search: typedSearch });
								setTypedSearch(typedSearch);
							}
						}}
						onClear={() => {
							setTypedSearch('');
							// ✅ nuqs - Limpa busca e volta para página 1
							setParams({ page: 1, search: '' });
							setTypedSearch('');
						}}
					/>
					<Button
						className="min-h-[56px] min-w-[56px]"
						color="default"
						onClick={() => {
							// ✅ nuqs - Aplica busca
							setParams({ page: 1, search: typedSearch });
							setTypedSearch(typedSearch);
						}}
					>
						<Icon name="Search" variant="solid" size="20" />
					</Button>
				</Stack>

				{/* Resultados e filtros ativos */}
				{search && (
					<div className="flex flex-wrap gap-1">
						<p>Filtros ativos:</p>
						<Badge
							color="primary"
							variant="flat"
							onClose={() => {
								// ✅ nuqs - Limpa filtros
								setParams({ page: 1, search: '' });
								setTypedSearch('');
							}}
						>
							Busca: {search}
						</Badge>
					</div>
				)}

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
						page={page}
						showControls
						onChange={(newPage: number) => {
							setParams({ page: newPage, search: search });
						}}
					/>
				)}
			</Stack>
		</div>
	);
}
