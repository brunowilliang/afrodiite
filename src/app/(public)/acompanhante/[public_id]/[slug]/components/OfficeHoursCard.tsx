import type { OfficeHour } from '@/api/utils/schemas/escort-core';
import { InfoCard } from './InfoCard';

interface OfficeHoursCardProps {
	office_hours?: OfficeHour[] | null;
}

export const OfficeHoursCard = ({ office_hours }: OfficeHoursCardProps) => {
	const officeHourTranslations: Record<OfficeHour['day'], string> = {
		monday: 'Segunda-feira:',
		tuesday: 'Terça-feira:',
		wednesday: 'Quarta-feira:',
		thursday: 'Quinta-feira:',
		friday: 'Sexta-feira:',
		saturday: 'Sábado:',
		sunday: 'Domingo:',
	};

	return (
		<InfoCard
			title="Horário de expediente"
			icon="ClockSquare"
			data={(office_hours ?? []).map((hour) => ({
				key: hour.day,
				label: officeHourTranslations[hour.day],
				value: `${hour.start} - ${hour.end}`,
			}))}
		/>
	);
};
