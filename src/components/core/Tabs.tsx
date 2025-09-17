import { useSlot, useStyled } from 'use-styled';
import { Icon } from './Icon';

const TabsRoot = useStyled('div', {
	base: {
		className: 'flex flex-col gap-1 rounded-xl bg-default/10 p-2',
	},
});

const TabsItem = useStyled('div', {
	base: {
		className:
			'flex w-full items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-primary-600',
	},
});

const TabsTitle = useStyled('span', {
	base: {
		className: '',
	},
});

export const Tabs = useSlot(TabsRoot, {
	Item: TabsItem,
	Title: TabsTitle,
	Icon: Icon,
});

export const TabsExample = () => {
	return (
		<Tabs>
			<Tabs.Item>
				<Tabs.Icon name="Home" size="18" />
				<Tabs.Title>Tab 1</Tabs.Title>
			</Tabs.Item>
			<Tabs.Item>
				<Tabs.Title>Tab 2</Tabs.Title>
			</Tabs.Item>
			<Tabs.Item>
				<Tabs.Title>Tab 3</Tabs.Title>
			</Tabs.Item>
		</Tabs>
	);
};
