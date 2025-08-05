import { useSlot, useStyled } from 'use-styled';
import { Stack } from './Stack';
import { Text } from './Text';

const TabsRoot = useStyled(Stack, {
	base: {
		direction: 'row',
		className:
			'centered relative h-[60px] w-fit gap-1 overflow-hidden rounded-lg bg-accent-10 p-1',
	},
});

const TabItemRoot = useStyled(Stack, {
	base: {
		className: 'centered relative h-full cursor-pointer rounded-md px-4',
	},
	variants: {
		isActive: {
			true: {
				className: 'bg-text-primary/10 text-text-primary',
			},
			false: {
				className: 'text-text-secondary',
			},
		},
	},
});

const TabItemText = useStyled(Text, {
	base: {},
});

export const Tabs = useSlot(TabsRoot, {
	Item: useSlot(TabItemRoot, {
		Text: TabItemText,
	}),
});
