import { Icon } from '@/components/core/Icon';
import { DATA_SERVICES } from '@/utils/services';
import { InfoCard } from './InfoCard';

interface ServicesCardProps {
	services?: number[] | null;
	onServiceClick: (service: { label: string; description: string }) => void;
}

export const ServicesCard = ({
	services,
	onServiceClick,
}: ServicesCardProps) => {
	return (
		<InfoCard
			title="Serviços"
			icon="Services"
			data={
				(services ?? [])
					.map((serviceId) => {
						const service = DATA_SERVICES.find((s) => s.id === serviceId);
						if (!service) return null;

						return {
							key: serviceId.toString(),
							label: service.label,
							value: (
								<Icon
									name="Info"
									variant="bulk"
									size="20"
									className="cursor-pointer"
									onClick={() => {
										onServiceClick({
											label: service.label,
											description: service.description,
										});
									}}
								/>
							),
						};
					})
					.filter(Boolean) as Array<{
					key: string;
					label: string;
					value: React.ReactNode;
				}>
			}
		/>
	);
};
