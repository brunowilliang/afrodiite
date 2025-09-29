import { Card, Chip } from '@heroui/react';
import { Stack } from '@/components/core/Stack';

// import { Text } from '@/components/core/Text';

interface InfoCardProps {
	title: string;
	data: Array<{
		key: string;
		label: string;
		value: string | React.ReactNode;
		action?: () => void;
	}>;
}

export const InfoCard = ({ title, data }: InfoCardProps) => {
	return (
		<Card className="p-5">
			<Chip color="primary" variant="flat" radius="sm" className="mb-2">
				{title}
			</Chip>
			{data.map(({ key, label, value, action }) => (
				<Stack
					key={key}
					direction="row"
					className="items-center gap-1 border-divider/40 border-b py-4 last:border-b-0 last:pb-0"
				>
					<span className="font-bold">{label}</span>
					{action ? (
						<div onClick={action} className="cursor-pointer">
							{value}
						</div>
					) : (
						<span className="font-light">{value}</span>
					)}
				</Stack>
			))}
		</Card>
	);
};
