'use client';

import { Badge as HeroBadge } from '@/components/core/Badge';
import { Icon, IconProps } from '@/components/core/Icon';

type Props = {
	icon: IconProps['name'];
	label: string;
};

export const Badge = ({ icon, label }: Props) => {
	return (
		<HeroBadge>
			<Icon name={icon} variant="bulk" size="20" />
			{label}
		</HeroBadge>
	);
};
