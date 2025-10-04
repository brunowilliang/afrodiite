// import { Text } from '@/components/core/Text';

import { Badge } from '@/components/core/Badge';
import { Card } from '@/components/core/Card';
import { IconProps } from '@/components/core/Icon';

interface TextCardProps {
	title: string;
	icon?: IconProps['name'];
	text: string;
	fallbackText?: string;
}

export const TextCard = ({
	title,
	icon,
	text,
	fallbackText = 'Sem informação.',
}: TextCardProps) => {
	return (
		<Card className="gap-4 p-5">
			<Badge.Custom label={title} icon={icon} size="md" className="py-5" />
			<span className="font-normal text-default-600">
				{text || fallbackText}
			</span>
		</Card>
	);
};
