import { Button as ButtonEmail } from '@react-email/components';
import { useStyled } from 'use-styled';

export const Button = useStyled(ButtonEmail, {
	base: {
		className: 'w-full rounded py-3 text-center font-semibold no-underline',
	},
	variants: {
		variant: {
			primary: {
				className: 'bg-[#8234e9] text-[#efe6fc]',
			},
			secondary: {
				className: 'bg-[#1A1A1E] text-[#efe6fc]',
			},
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});
