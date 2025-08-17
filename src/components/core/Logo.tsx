import { useStyled } from 'use-styled';

export const Logo = useStyled('img', {
	base: {
		src: '/assets/logo.svg',
		alt: 'Logo',
		className: 'size-28',
	},
	variants: {
		size: {
			sm: {},
			md: {},
			lg: {},
		},
	},
});
