import { useSlot, useStyled } from 'use-styled';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';
import { Text } from './Text';

const BadgeRoot = useStyled('div', {
	base: {
		className: 'group flex items-start gap-2',
	},
	variants: {
		colorScheme: {
			primary: {
				className: 'is-primary',
			},
			secondary: {
				className: 'is-secondary',
			},
		},
		variant: {
			filled: {
				className: 'is-filled',
			},
			styled: {
				className: 'is-styled',
			},
		},
	},
	defaultVariants: {
		colorScheme: 'secondary',
		variant: 'styled',
	},
});

const BadgeTextRoot = useStyled(Text, {
	base: {
		as: 'p',
		weight: 'normal',
		className: cn(
			'relative z-2 px-3 py-0.5',
			// Estilos para is-styled (com after)
			'group-[.is-styled]:after:-z-1 group-[.is-styled]:after:absolute group-[.is-styled]:after:right-0 group-[.is-styled]:after:bottom-0 group-[.is-styled]:after:left-0 group-[.is-styled]:after:h-1/2 group-[.is-styled]:after:rounded-sm',
			'group-[.is-styled.is-primary]:after:bg-primary-10 group-[.is-styled.is-secondary]:after:bg-accent-10',
			// Estilos para is-filled (com background e borda)
			'group-[.is-filled]:rounded-sm group-[.is-filled]:border-none',
			'group-[.is-filled.is-primary]:border-primary-20 group-[.is-filled.is-primary]:bg-primary-10',
			'group-[.is-filled.is-secondary]:border-accent-20 group-[.is-filled.is-secondary]:bg-accent-10',
		),
	},
});

export const Badge = useSlot(BadgeRoot, {
	Text: BadgeTextRoot,
	Icon,
});
