import {
	Select as HeroSelect,
	SelectItem as HeroSelectItem,
} from '@heroui/react';
import { useSlot, useStyled } from 'use-styled';
import { cn } from '@/utils/cn';

export const SelectRoot = useStyled(HeroSelect, {
	base: {
		children: null,
		isClearable: true,
		size: 'md',
		variant: 'flat',
		radius: 'sm',
		classNames: {
			label: cn('text-foreground/50'),
			trigger: cn(
				'group-data-[invalid=true]:!border-2',
				'group-data-[invalid=true]:!border-danger',
				'group-data-[invalid=true]:!bg-danger/5',
				'data-[disabled]:opacity-80',
			),
		},
	},
});

export const InputSelectItemRoot = useStyled(HeroSelectItem, {
	base: {
		color: 'primary',
		variant: 'flat',
		classNames: {
			base: cn('data-[selected]:bg-primary/10'),
			selectedIcon: cn('text-primary'),
			title: cn('text-foreground/50', 'group-data-[selected]:text-primary'),
		},
	},
});

(
	InputSelectItemRoot as {
		getCollectionNode?: any;
	}
).getCollectionNode = (
	HeroSelectItem as {
		getCollectionNode?: any;
	}
).getCollectionNode;

export const Select = useSlot(SelectRoot, {
	Item: InputSelectItemRoot,
});
