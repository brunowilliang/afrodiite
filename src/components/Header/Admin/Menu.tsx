'use client';

import { usePathname } from 'next/navigation';
import { Tabs } from '@/components/core/Tabs';
import { AuthMenu, Navigation } from '@/components/Header/links';
import { renderMenuItem } from '@/components/Header/renderMenuItem';
import { useReviews } from '@/hooks/useReviews';

type Props = {
	onTabClick?: () => void;
};

export const MenuTabs = ({ onTabClick }: Props) => {
	const pathname = usePathname();

	const menu: Navigation[] = [];

	AuthMenu.forEach((item) => {
		if (item.sections?.length) {
			menu.push(item);
			menu.push(...item.sections);
		} else {
			menu.push(item);
		}
	});

	const { reviews } = useReviews();
	const pendingReviews = reviews.results.filter(
		(review) => review.status === 'pending',
	);

	return (
		<Tabs aria-label="tabs-menu-web" isMenu selectedKey={pathname}>
			{menu.map((item) =>
				renderMenuItem({
					item,
					location: pathname,
					onTabClick,
					badge: pendingReviews.length,
				}),
			)}
		</Tabs>
	);
};
