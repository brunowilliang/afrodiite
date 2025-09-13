import { useRouter } from '@tanstack/react-router';
import { type RefObject, useState } from 'react';
import { Badge } from '@/components/core/Badge';
import { Input } from '@/components/core/Input';
import { Navigation } from '@/components/core/Navigation';
import { Stack } from '@/components/core/Stack';
import { Modal, type ModalRef } from '@/components/heroui/Modal';
import { NavigationMenu } from '@/utils/data';
import { Text } from './core/Text';

export interface Location {
	label: string;
	badge: string;
}

export interface LocationSelectorProps {
	ref: RefObject<ModalRef | null>;
}

export const CommandPalette = ({ ref }: LocationSelectorProps) => {
	const [searchTerm, setSearchTerm] = useState('');
	const router = useRouter();

	const handleLocationSelect = (href: string) => {
		ref.current?.close();
		setSearchTerm('');
		router.navigate({ to: href });
	};

	return (
		<Modal
			ref={ref}
			onClose={() => setSearchTerm('')}
			size="lg"
			placement="top"
		>
			<Input
				placeholder="Pesquise por região, cidade ou modelo"
				colorScheme="secondary"
				value={searchTerm}
				autoFocus
				onChange={(e) => setSearchTerm(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleLocationSelect(searchTerm);
					}
				}}
			/>
			<Stack className="w-full gap-4">
				{NavigationMenu.length > 0 && (
					<Badge>
						<Badge.Text>Regiões mais populares</Badge.Text>
					</Badge>
				)}
				<Navigation className="w-full">
					{NavigationMenu.map((location, index) => (
						<>
							<Navigation.SubMenu.Item
								key={location.name}
								label={location.name}
								badge={location.cities.length.toString()}
								onClick={() => handleLocationSelect(location.href)}
							/>
							{index < NavigationMenu.length - 1 && (
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
