import { createElement } from 'react';
import { useStyled } from 'use-styled';

type Props = React.HTMLAttributes<React.ElementType> & {
	as?: React.ElementType;
};

export function StackComponent({ as = 'div', children, ...props }: Props) {
	return createElement(as, { ...props }, children);
}

export const Stack = useStyled(StackComponent, {
	base: {
		className: 'flex',
	},
	variants: {
		direction: {
			row: {
				className: 'flex-row',
			},
			column: {
				className: 'flex-col',
			},
		},
		carousel: {
			true: {
				className: 'overflow-auto',
			},
		},
		container: {
			true: {
				as: 'section',
				className: 'mx-auto w-full max-w-[1200px] px-4 py-8',
			},
		},
		hasHeader: {
			true: {
				className: 'mt-[86px] gap-4 py-4 pb-32',
			},
		},
	},
	defaultVariants: {
		direction: 'column',
	},
});

export const Container = useStyled(Stack, {
	base: {
		container: true,
	},
});
