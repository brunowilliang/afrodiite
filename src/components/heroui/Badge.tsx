import { Chip } from '@heroui/react';
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
