import { useSlot, useStyled } from 'use-styled';
import { Icon } from './Icon';
import { Text } from './Text';

const ButtonRoot = useStyled('button', {
	base: {
		className:
			'centered flex h-[60px] gap-1 rounded-lg font-normal text-text-primary',
	},
	variants: {
		variant: {
			primary: {
				className: 'bg-primary px-5',
			},
			accent: {
				className: 'bg-accent px-5',
			},
			light: {
				className: 'bg-transparent px-5 text-primary',
			},
			unstyled: {
				className: 'bg-transparent',
			},
			'unstyled-danger': {
				className: 'bg-transparent text-danger',
			},
		},
		clickable: {
			true: {
				className: 'cursor-pointer',
			},
			false: {
				className: 'cursor-default',
			},
		},
		backButton: {
			true: {
				className: 'pl-2',
			},
		},
	},
	defaultVariants: {
		variant: 'primary',
		clickable: true,
	},
});

export const Button = useSlot(ButtonRoot, {
	Text,
	Icon,
});
