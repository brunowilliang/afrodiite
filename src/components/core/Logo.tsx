import { useStyled } from 'use-styled';
import { Logo as AfrodiiteLogo } from '@/components/Logo';

export const Logo = useStyled(AfrodiiteLogo, {
	base: {
		className: 'h-full w-30 cursor-pointer',
	},
});
