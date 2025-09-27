import { Button as HeroButton } from '@heroui/react';
import { useStyled } from 'use-styled';

export const Button = useStyled(HeroButton, {
	base: {
		size: 'lg',
		radius: 'sm',
		color: 'primary',
		className: 'cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
	},
});
