'use client';

import { Chip } from '@heroui/react';
import { ComponentProps } from 'react';
import { useStyled } from 'use-styled';

export const Badge = useStyled(Chip, {
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

export type BadgeProps = ComponentProps<typeof Badge>;
