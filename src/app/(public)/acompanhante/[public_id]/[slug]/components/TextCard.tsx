// import { Text } from '@/components/core/Text';

import { Badge } from '@/components/core/Badge';
import { Card } from '@/components/core/Card';

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
			<Badge color="primary" variant="flat" radius="sm" className="mb-2">
				{title}
			</Badge>
			<span className="font-normal">{text || fallbackText}</span>
		</Card>
	);
};
