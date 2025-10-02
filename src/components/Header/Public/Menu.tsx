'use client';

import { usePathname } from 'next/navigation';
import { Tabs } from '@/components/core/Tabs';
import { Navigation, PublicMenu } from '@/components/Header/links';
import { renderMenuItem } from '@/components/Header/renderMenuItem';

type Props = {
	onTabClick?: () => void;
};

export const MenuTabs = ({ onTabClick }: Props) => {
	const pathname = usePathname();

	const menu: Navigation[] = [];

	PublicMenu.forEach((item) => {
		if (item.sections?.length) {
			menu.push(item);
			menu.push(...item.sections);
		} else {
			menu.push(item);
		}
	});

	return (
		<Tabs aria-label="tabs-menu-web" isMenu selectedKey={pathname}>
			{menu.map((item) =>
				renderMenuItem({ item, location: pathname, onTabClick }),
			)}
		</Tabs>
	);
};
