import { createElement } from 'react';
import { useStyled } from 'use-styled';

type TextBaseProps = React.HTMLAttributes<HTMLElement> & {
	as?:
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'p'
		| 'span'
		| 'li'
		| 'ul'
		| 'ol'
		| 'label';
};

export function TextBase({ as = 'span', children, ...props }: TextBaseProps) {
	return createElement(as, { ...props }, children);
}

export const Text = useStyled(TextBase, {
	base: {},
	variants: {
		as: {
			h1: { as: 'h1', className: 'text-4xl' },
			h2: { as: 'h2', className: 'text-3xl' },
			h3: { as: 'h3', className: 'text-2xl' },
			h4: { as: 'h4', className: 'text-xl' },
			h5: { as: 'h5', className: 'text-lg tracking-wider' },
			h6: { as: 'h6', className: 'text-base tracking-wider' },
			p: { as: 'p', className: 'text-base tracking-wider' },
			span: { as: 'span', className: 'text-base tracking-wider' },
			li: { as: 'li', className: 'text-base tracking-wider' },
			ul: { as: 'ul', className: 'text-base tracking-wider' },
			ol: { as: 'ol', className: 'text-base tracking-wider' },
			label: { as: 'label', className: 'text-base tracking-wider' },
		},

		size: {
			xs: { className: 'text-xs' },
			sm: { className: 'text-sm' },
			md: { className: 'text-base' },
			lg: { className: 'text-lg' },
			xl: { className: 'text-xl' },
			'2xl': { className: 'text-2xl' },
			'3xl': { className: 'text-3xl' },
			'4xl': { className: 'text-4xl' },
			'5xl': { className: 'text-5xl' },
			'6xl': { className: 'text-6xl' },
			'7xl': { className: 'text-7xl' },
			'8xl': { className: 'text-8xl' },
			'9xl': { className: 'text-9xl' },
		},

		align: {
			center: { className: 'text-center' },
			right: { className: 'text-right' },
			left: { className: 'text-left' },
		},

		color: {
			primary: { className: 'text-primary' },
			textPrimary: { className: 'text-text-primary' },
			textSecondary: { className: 'text-text-secondary' },
			accent: { className: 'text-accent-10' },
		},

		weight: {
			light: { className: 'font-extralight' },
			normal: { className: 'font-normal' },
			bold: { className: 'font-semibold' },
		},
	},
	defaultVariants: {
		as: 'p',
	},
});
