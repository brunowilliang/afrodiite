import { Chip } from '@heroui/react';
import { Stack } from '@/components/core/Stack';
import { Card } from '@/components/heroui/Card';

type Props = {
	title?: string;
	children?: React.ReactNode;
};

export const Section = ({ title, children }: Props) => (
	<Stack className="gap-3">
		<Chip color="primary" variant="flat" size="md" radius="sm">
			{title}
		</Chip>
		<Card className="p-4" shadow="none">
			<span className="font-light text-default-600 text-small leading-6">
				{children}
			</span>
		</Card>
	</Stack>
);
