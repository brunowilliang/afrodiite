'use client';

import { Chip } from '@heroui/react';
import { ComponentProps } from 'react';
import { useSlot, useStyled } from 'use-styled';

export type BadgeProps = ComponentProps<typeof BadgeRoot>;

export const BadgeRoot = useStyled(Chip, {
	base: {
		color: 'primary',
		size: 'md',
		variant: 'flat',
		radius: 'sm',
		classNames: {
			base: 'py-4',
			content: 'centered flex gap-2',
		},
	},
});

import { Icon, IconProps } from '@/components/core/Icon';

type Props = BadgeProps & {
	icon?: IconProps['name'];
	label: string;
};

export const BadgeCustom = ({ icon, label, ...props }: Props) => {
	return (
		<BadgeRoot {...props}>
			{icon && <Icon name={icon} variant="bulk" size="20" />}
			{label}
		</BadgeRoot>
	);
};

export const Badge = useSlot(BadgeRoot, {
	Custom: BadgeCustom,
});
