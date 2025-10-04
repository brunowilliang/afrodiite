import { Card } from '@heroui/react';
import { Badge } from '@/components/core/Badge';
import { IconProps } from '@/components/core/Icon';
import { Stack } from '@/components/core/Stack';

// import { Text } from '@/components/core/Text';

interface InfoCardProps {
	title: string;
	icon: IconProps['name'];
	data: Array<{
		key: string;
		label: string;
		value: string | React.ReactNode;
		action?: () => void;
	}>;
}

export const InfoCard = ({ title, icon, data }: InfoCardProps) => {
	return (
		<Card className="p-5">
			<Badge.Custom label={title} icon={icon} size="md" className="mb-2 py-5" />
			{data.map(({ key, label, value, action }) => (
				<Stack
					key={key}
					direction="row"
					className="items-center gap-1 border-divider/40 border-b py-4 last:border-b-0 last:pb-0"
				>
					<span className="font-normal text-default-600">{label}</span>
					{action ? (
						<div onClick={action} className="cursor-pointer">
							{value}
						</div>
					) : (
						<span className="centered flex font-light text-default-800">
							{value}
						</span>
					)}
				</Stack>
			))}
		</Card>
	);
};
