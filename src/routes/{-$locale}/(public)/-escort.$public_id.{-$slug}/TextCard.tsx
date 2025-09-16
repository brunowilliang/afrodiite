import { Card, Chip } from '@heroui/react';
import { Text } from '@/components/core/Text';

interface TextCardProps {
	title: string;
	text: string;
	fallbackText?: string;
}

export const TextCard = ({
	title,
	text,
	fallbackText = 'Sem informação.',
}: TextCardProps) => {
	return (
		<Card className="gap-4 p-5">
			<Chip color="primary" variant="flat" radius="sm" className="mb-2">
				{title}
			</Chip>
			<Text weight="normal">{text || fallbackText}</Text>
		</Card>
	);
};
