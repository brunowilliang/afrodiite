import type { Characteristics } from '@/api/utils/schemas/escort-core';
import { InfoCard } from './InfoCard';

interface CharacteristicsCardProps {
	characteristics?: Characteristics | null;
}

export const CharacteristicsCard = ({
	characteristics,
}: CharacteristicsCardProps) => {
	const caracteristicsTranslations: Record<keyof Characteristics, string> = {
		gender: 'Gênero',
		age: 'Idade',
		height: 'Altura',
		weight: 'Peso',
		hair_color: 'Cor do cabelo',
		eye_color: 'Cor dos olhos',
		sexual_preference: 'Preferência sexual',
		ethnicity: 'Etnia',
		silicone: 'Silicone',
		tattoos: 'Tatuagens',
		piercings: 'Piercings',
		smoker: 'Fumante',
		languages: 'Idiomas',
	};

	return (
		<InfoCard
			title="Características"
			data={Object.entries(characteristics ?? {}).map(([key, value]) => ({
				key,
				label: `${caracteristicsTranslations[key as keyof Characteristics]}:`,
				value:
					typeof value === 'boolean'
						? value
							? 'Sim'
							: 'Não'
						: (value as string),
			}))}
		/>
	);
};
