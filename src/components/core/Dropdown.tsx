'use client';

import {
	Dropdown as HeroDropdown,
	DropdownItem as HeroDropdownItem,
	DropdownMenu as HeroDropdownMenu,
	DropdownSection as HeroDropdownSection,
	DropdownTrigger as HeroDropdownTrigger,
} from '@heroui/react';
import { useSlot, useStyled } from 'use-styled';

const DropdownRoot = useStyled(HeroDropdown, {
	base: {
		children: null as never,
		classNames: { backdrop: 'bg-black/20' },
	},
});

export const Dropdown = useSlot(DropdownRoot, {
	Item: HeroDropdownItem,
	Menu: HeroDropdownMenu,
	Trigger: HeroDropdownTrigger,
	Section: HeroDropdownSection,
});
