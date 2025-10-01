'use client';

import { Pagination } from '@heroui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/core/Badge';
import { Icon } from '@/components/core/Icon';
import { Input } from '@/components/core/Input';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/orpc';
import { PortugalDistricts } from '@/utils/lists/Portugal';
import { EscortCard } from './components/card';
import { searchParams } from './searchParams';

export default function PortugalIndex() {
	const [{ page, search }, setParams] = useQueryStates(searchParams);
	const [typedSearch, setTypedSearch] = useState(search);
	const [inputValue, setInputValue] = useState('');

	// Intelligent search filtering
	const filteredItems = useMemo(() => {
		if (!inputValue) return PortugalDistricts;

		const searchTerm = inputValue.toLowerCase().trim();

		return PortugalDistricts.map((item) => {
			const city = item.city.toLowerCase();
			const district = item.district.toLowerCase();

			let score = 0;

			// Exact city match gets highest priority
			if (city === searchTerm) score += 100;
			// City starts with search term
			else if (city.startsWith(searchTerm)) score += 80;
			// City contains search term
			else if (city.includes(searchTerm)) score += 60;

			// Exact district match gets high priority
			if (district === searchTerm) score += 90;
			// District starts with search term
			else if (district.startsWith(searchTerm)) score += 70;
			// District contains search term
			else if (district.includes(searchTerm)) score += 50;

			return { ...item, score };
		})
			.filter((item) => item.score > 0)
			.sort((a, b) => b.score - a.score);
	}, [inputValue]);

	const { data } = useSuspenseQuery(
		api.queries.escorts.list.queryOptions({
			input: { page, search },
		}),
	);

	return (
		<Stack className="gap-20 pt-20">
			<Stack direction="column" className="w-full max-w-lg gap-2 self-center">
				<Stack className="centered gap-1 py-5 text-center">
					<Badge variant="flat" color="primary">
						Encontre
					</Badge>
					<h1 className="mt-2 font-semibold text-3xl text-default-800">
						Escorts em Portugal
					</h1>
					<p className="text-default-600">
						Descubra as melhores acompanhantes em todo o país
					</p>
				</Stack>

				<Input.AutoComplete
					label="Pesquise por nome, cidade ou distrito"
					allowsCustomValue
					isClearable
					onInputChange={(value) => {
						setInputValue(value);
						setTypedSearch(value);
					}}
					onSelectionChange={(key) => {
						if (key) {
							// Find the selected item to get the city name
							const selectedItem = filteredItems.find(
								(item) => `${item.city}-${item.district}` === key,
							);
							const searchValue = selectedItem
								? selectedItem.city
								: (key as string);

							setParams({ page: 1, search: searchValue });
							setTypedSearch(searchValue);
							setInputValue(searchValue);
						}
					}}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							setParams({ page: 1, search: typedSearch });
							setTypedSearch(typedSearch);
						}
					}}
					onClear={() => {
						setTypedSearch('');
						setInputValue('');
						setParams({ page: 1, search: '' });
					}}
					items={filteredItems}
					selectedKey={search}
					inputValue={typedSearch}
				>
					{filteredItems.map((item) => {
						const isDistrict = item.district === item.city;
						const uniqueKey = `${item.city}-${item.district}`;
						return (
							<Input.AutoComplete.Item key={uniqueKey} textValue={item.city}>
								{isDistrict ? (
									<span className="flex items-center gap-1">
										<Icon name="Location" size="16" />
										{item.district}
									</span>
								) : (
									<span>
										{item.city}, {item.district}
									</span>
								)}
							</Input.AutoComplete.Item>
						);
					})}
				</Input.AutoComplete>
			</Stack>

			{/* Resultados e filtros ativos */}
			{/* {search && (
						<div className="flex flex-wrap items-center gap-1">
							<p>Filtros ativos:</p>
							<Badge
								color="primary"
								variant="flat"
								prefix="🔍"
								onClose={() => {
									setParams({ page: 1, search: '' });
									setTypedSearch('');
								}}
							>
								Busca: {search}
							</Badge>
						</div>
					)} */}

			<Stack>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
					{data?.results?.map((profile) => {
						return <EscortCard key={profile.id} profile={profile as any} />;
					})}
				</div>
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
			</Stack>
		</Stack>
	);
}
