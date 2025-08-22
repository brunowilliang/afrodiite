import {
	Accordion,
	AccordionItem,
	Chip,
	Listbox,
	ListboxItem,
} from '@heroui/react';
import { PortugalCities } from '../../utils/lists/PortugalCities';
import { Stack } from '../core/Stack';
import { Text } from '../core/Text';

interface CityData {
	city: string;
	admin_name: string;
	population: string;
	population_proper: string;
	capital: string;
}

interface MenuItemData {
	id: string;
	title: string;
	badge?: {
		content: string | number;
		color?:
			| 'default'
			| 'primary'
			| 'secondary'
			| 'success'
			| 'warning'
			| 'danger';
	};
	children?: MenuItemData[];
	action?: () => void;
	cityData?: CityData;
}

// Função para agrupar cidades por distrito
const groupCitiesByDistrict = () => {
	const districts: { [key: string]: CityData[] } = {};

	PortugalCities.forEach((city) => {
		const district = city.admin_name;
		if (!districts[district]) {
			districts[district] = [];
		}
		districts[district].push(city as CityData);
	});

	return districts;
};

// Função para determinar a cor do badge baseado no tipo de capital
const getBadgeColor = (
	capital: string,
): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
	switch (capital) {
		case 'primary':
			return 'primary';
		case 'admin':
			return 'success';
		case 'minor':
			return 'warning';
		default:
			return 'default';
	}
};

// Gerar dados do menu automaticamente
const generateMenuData = (): MenuItemData[] => {
	const districts = groupCitiesByDistrict();

	return Object.entries(districts)
		.map(([districtName, cities]) => ({
			id: districtName.toLowerCase().replace(/\s+/g, '-'),
			title: districtName,
			badge: {
				content: cities.length,
				color: (cities.length > 10
					? 'primary'
					: cities.length > 5
						? 'success'
						: 'warning') as
					| 'default'
					| 'primary'
					| 'secondary'
					| 'success'
					| 'warning'
					| 'danger',
			},
			children: cities.map((city) => ({
				id: city.city.toLowerCase().replace(/\s+/g, '-'),
				title: city.city,
				badge: city.capital
					? {
							content:
								city.capital === 'primary'
									? '★'
									: city.capital === 'admin'
										? 'ADM'
										: 'MIN',
							color: getBadgeColor(city.capital),
						}
					: undefined,
				cityData: city,
				action: () =>
					console.log(
						`Cidade selecionada: ${city.city}, População: ${city.population}`,
					),
			})),
		}))
		.sort((a, b) => a.title.localeCompare(b.title));
};

const menuData = generateMenuData();

const MenuItem = ({
	item,
	level = 0,
}: {
	item: MenuItemData;
	level?: number;
}) => {
	const paddingLeft = level * 16;

	return (
		<Listbox
			variant="flat"
			classNames={{
				base: 'p-0 pb-0.5 pr-3',
			}}
			style={{
				paddingLeft: `${paddingLeft}px`,
			}}
			onClick={item.action}
		>
			<ListboxItem>
				<div className="flex w-full items-center justify-between px-1">
					<Text className="text-default-700">{item.title}</Text>
					{item.badge && (
						<Chip size="sm" variant="flat" color={'primary'}>
							20
						</Chip>
					)}
				</div>
			</ListboxItem>
		</Listbox>
	);
};

export const NestedMenu = () => {
	return (
		<Stack className="w-full max-w-xs border-none bg-transparent">
			<Accordion
				variant="light"
				itemClasses={{
					base: 'w-full',
					title: 'font-normal text-medium text-default-800',
					trigger: 'py-3 rounded-lg flex items-center',
					indicator: 'text-medium',
					content: 'text-small m-0',
				}}
			>
				{menuData.map((item) => (
					<AccordionItem
						key={item.id}
						aria-label={item.title}
						classNames={{
							base: 'p-0',
							trigger: 'p-3 pl-4',
							content: 'p-0 pb-2',
						}}
						title={
							<div className="flex w-full items-center justify-between">
								{item.title}
								{item.badge && (
									<Chip size="sm" color={'primary'} variant="flat">
										{item.badge.content}
									</Chip>
								)}
							</div>
						}
					>
						{item.children?.map((child) => (
							<MenuItem key={child.id} item={child} level={1} />
						))}
					</AccordionItem>
				))}
			</Accordion>
		</Stack>
	);
};
