import {
	Dropdown as HeroDropdown,
	DropdownItem as HeroDropdownItem,
	DropdownMenu as HeroDropdownMenu,
	DropdownSection as HeroDropdownSection,
	DropdownTrigger as HeroDropdownTrigger,
} from '@heroui/react';
import { useSlot } from 'use-styled';

export const Dropdown = useSlot(HeroDropdown, {
	Item: HeroDropdownItem,
	Menu: HeroDropdownMenu,
	Trigger: HeroDropdownTrigger,
	Section: HeroDropdownSection,
});
