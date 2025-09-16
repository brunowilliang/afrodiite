import type { Price } from '@/api/utils/schemas/escort-core';
import { InfoCard } from './InfoCard';

interface PricesCardProps {
	prices?: Price[] | null;
}

export const PricesCard = ({ prices }: PricesCardProps) => {
	const priceTranslations: Record<Price['slot'], string> = {
		'30m': '30 minutos:',
		'1h': '1 hora:',
		'2h': '2 horas:',
		'4h': '4 horas:',
		daily: 'Diária:',
		overnight: 'Pernoite:',
		travel: 'Diária de viagem:',
		outcall: 'Deslocação:',
	};

	return (
		<InfoCard
			title="Valores"
			data={(prices ?? []).map((price) => ({
				key: price.slot,
				label: priceTranslations[price.slot],
				value: price.is_available ? `€ ${price.amount}` : 'Não realiza',
			}))}
		/>
	);
};
