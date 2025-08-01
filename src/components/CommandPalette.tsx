import { type RefObject, useState } from 'react';
import { Badge } from '@/components/core/Badge';
import { Input } from '@/components/core/Input';
import { Modal, type ModalRef } from '@/components/core/Modal';
import { Navigation } from '@/components/core/Navigation';
import { Stack } from '@/components/core/Stack';
import { Text } from './core/Text';

export interface Location {
	label: string;
	badge: string;
}

export interface LocationSelectorProps {
	ref: RefObject<ModalRef | null>;
}

const locations: Location[] = [
	{ label: 'Porto', badge: '30' },
	{ label: 'Lisboa', badge: '80' },
	{ label: 'Braga', badge: '15' },
	{ label: 'Faro', badge: '20' },
	{ label: 'Coimbra', badge: '25' },
	{ label: 'Aveiro', badge: '18' },
	{ label: 'Setúbal', badge: '42' },
];

export const CommandPalette = ({ ref }: LocationSelectorProps) => {
	const [searchTerm, setSearchTerm] = useState('');

	const filteredLocations = locations.filter((location) =>
		location.label.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleLocationSelect = () => {
		ref.current?.close();
		setSearchTerm('');
	};

	return (
		<Modal
			ref={ref}
			onClose={() => setSearchTerm('')}
			size="lg"
			position="top"
			topOffset="top-30"
		>
			<Input
				placeholder="Pesquise por região, cidade ou modelo"
				colorScheme="secondary"
				value={searchTerm}
				autoFocus
				onChange={(e) => setSearchTerm(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleLocationSelect();
					}
				}}
			/>
			<Stack className="w-full gap-4">
				{filteredLocations.length > 0 && (
					<Badge>
						<Badge.Text>Regiões mais populares</Badge.Text>
					</Badge>
				)}
				<Navigation className="w-full">
					{filteredLocations.map((location, index) => (
						<>
							<Navigation.SubMenu.Item
								key={location.label}
								label={location.label}
								badge={location.badge}
								onClick={() => handleLocationSelect()}
							/>
							{index < filteredLocations.length - 1 && (
								<div className="h-px w-full bg-accent-10" />
							)}
						</>
					))}
				</Navigation>
				{searchTerm.length > 0 && (
					<Stack className="gap-2">
						<Text color="textSecondary">Pesquisando por:</Text>
						<Badge variant="filled">
							<Badge.Text>{searchTerm}</Badge.Text>
						</Badge>
					</Stack>
				)}
			</Stack>
		</Modal>
	);
};
