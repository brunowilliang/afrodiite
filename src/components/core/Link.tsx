'use client';

import { Link as HeroLink } from '@heroui/react';
import { useStyled } from 'use-styled';

export const Link = useStyled(HeroLink, {
	base: {
		className: 'cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
	},
});
