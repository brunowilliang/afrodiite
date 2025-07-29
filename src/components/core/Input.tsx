'use client';

import { useSlot, useStyled } from 'use-styled';

const InputRoot = useStyled('input', {
	base: {
		className:
			'h-[56px] w-full rounded-lg border border-accent-10 bg-accent p-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-0 focus:ring-offset-0',
	},
	variants: {
		clickable: {
			true: {
				readOnly: true,
				className: 'cursor-pointer',
			},
		},
	},
});

export const Input = useSlot(InputRoot, {});

// <input type="checkbox" className="focus:ring-0 focus:ring-offset-0" />
