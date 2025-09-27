import {
	Autocomplete as HeroAutocomplete,
	AutocompleteItem as HeroAutocompleteItem,
} from '@heroui/react';
import { useSlot, useStyled } from 'use-styled';
import { cn } from '@/utils/cn';

export const AutocompleteRoot = useStyled(HeroAutocomplete, {
	base: {
		children: null,
		size: 'md',
		variant: 'flat',
		radius: 'sm',
		className: cn(
			'text-foreground/50',
			'group-data-[invalid=true]:!border-2',
			'group-data-[invalid=true]:!border-danger',
			'group-data-[invalid=true]:!bg-danger/5',
			'data-[disabled]:opacity-80',
		),
		// classNames: {
		// 	base: cn(
		// 		'group-data-[invalid=true]:!border-2',
		// 		'group-data-[invalid=true]:!border-danger',
		// 		'group-data-[invalid=true]:!bg-danger/5',
		// 		'data-[disabled]:opacity-80',
		// 	),
		// },
	},
});

export const AutocompleteItemRoot = useStyled(HeroAutocompleteItem, {
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
	AutocompleteItemRoot as {
		getCollectionNode?: any;
	}
).getCollectionNode = (
	HeroAutocompleteItem as {
		getCollectionNode?: any;
	}
).getCollectionNode;

export const AutoComplete = useSlot(AutocompleteRoot, {
	Item: AutocompleteItemRoot,
});
