'use client';

import { useSlot, useStyled } from 'use-styled';
import { cn } from '@/lib/utils';

const InputRoot = useStyled('input', {
	base: {
		className: cn(
			'h-[60px] w-full rounded-lg border border-accent-10 bg-accent p-4 text-text-primary',
			'placeholder:text-text-secondary',
			'focus:border-text-secondary focus:outline-none focus:ring-0 focus:ring-offset-0',
			'transition-all duration-300',
		),
	},
	variants: {
		clickable: {
			true: {
				readOnly: true,
				className: 'cursor-pointer',
			},
		},
		colorScheme: {
			primary: {
				className: 'border-primary-20 bg-primary-10 text-primary',
			},
			secondary: {
				className: 'border-accent-10 bg-accent-10 text-text-secondary',
			},
		},
	},
});

export const Input = useSlot(InputRoot, {});
