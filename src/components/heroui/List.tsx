import { Listbox, ListboxItem, listboxSection } from '@heroui/react';
import { useSlot } from 'use-styled';

export const List = useSlot(Listbox, {
	Item: ListboxItem,
	Section: listboxSection,
});
