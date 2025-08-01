import { useSlot, useStyled } from 'use-styled';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';
import { Text } from './Text';

const CardRoot = useStyled('div', {
	base: {
		className:
			'flex flex-col items-start gap-5 rounded-xl border border-accent-10 bg-accent p-5 text-text-primary',
	},
	variants: {
		clickable: {
			true: {
				className:
					'cursor-pointer transition-all duration-250 ease-in-out hover:opacity-80 active:scale-99 active:opacity-100',
			},
		},
	},
});

const CardBadgeRoot = useStyled('div', {
	base: {
		className:
			'flex items-center gap-2 rounded-md px-2 py-1 font-normal text-text-primary',
	},
	variants: {
		colorScheme: {
			primary: {
				className: 'border border-primary-20 bg-primary-10 text-primary',
			},
			secondary: {
				className: 'bg-accent-10 text-text-secondary',
			},
		},
		size: {
			sm: {
				className: 'text-sm',
			},
			md: {
				className: 'text-md',
			},
			lg: {
				className: 'text-lg',
			},
		},
	},
	defaultVariants: {
		colorScheme: 'secondary',
		size: 'md',
	},
});

const CardListRoot = useStyled('div', {
	base: {
		className: 'w-full',
	},
});

const CardListItemRoot = useStyled('div', {
	base: {
		className: cn(
			'flex items-center justify-start gap-2 border-accent-10 border-b px-2 py-3',
			'last:border-b-0',
		),
	},
	variants: {
		invalid: {
			true: {
				className: 'line-through opacity-50',
			},
		},
	},
});

export const CardListItem = useSlot(CardListItemRoot, {
	Text,
	Icon,
});

const CardList = useSlot(CardListRoot, {
	Item: CardListItem,
});

export const CardBadge = useSlot(CardBadgeRoot, {
	Text,
	Icon,
});

export const Card = useSlot(CardRoot, {
	Badge: CardBadge,
	List: CardList,
});
