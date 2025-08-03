import type { ComponentProps } from 'react';
import { useStyled } from 'use-styled';

export type IconProps = ComponentProps<typeof Icon>;

export const Icon = useStyled('i', {
	base: {
		className: 'hgi',
	},
	variants: {
		variant: {
			stroke: {
				className: 'hgi-stroke',
			},
			solid: {
				className: 'hgi-solid',
			},
			bulk: {
				className: 'hgi-bulk',
			},
		},
		size: {
			'12': { className: 'text-[12px]' },
			'14': { className: 'text-[14px]' },
			'16': { className: 'text-[16px]' },
			'18': { className: 'text-[18px]' },
			'20': { className: 'text-[20px]' },
			'24': { className: 'text-[24px]' },
			'32': { className: 'text-[32px]' },
		},
		color: {
			primary: { className: 'text-primary' },
			textPrimary: { className: 'text-text-primary' },
			textSecondary: { className: 'text-text-secondary' },
		},
		name: {
			User: { className: 'hgi-user' },
			ArrowUp: { className: 'hgi-arrow-up-01' },
			ArrowDown: { className: 'hgi-arrow-down-01' },
			ArrowLeft: { className: 'hgi-arrow-left-01' },
			ArrowRight: { className: 'hgi-arrow-right-01' },
			Check: { className: 'hgi-checkmark-badge-02' },
			Star: { className: 'hgi-star' },
			Filter: { className: 'hgi-preference-horizontal' },
			Menu: { className: 'hgi-menu-03' },
			Close: { className: 'hgi-cancel-01' },
			Search: { className: 'hgi-search-01' },
			Home: { className: 'hgi-home-01' },
		},
	},
	defaultVariants: {
		variant: 'stroke',
		size: '24',
	},
});
