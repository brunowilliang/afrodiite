'use client';

import { usePathname } from 'next/navigation';
import { Tabs } from '@/components/core/Tabs';
import { AuthMenu, Navigation, PublicMenu } from '@/components/Header/Links';
import { useReviews } from '@/hooks/useReviews';
import { Href } from '@/providers/HeroUIProvider';

// Helper function to get menu items based on authentication status
const getMenuItems = (isAuthenticated: boolean): Navigation[] => {
	if (isAuthenticated) {
		// Filter items to exclude auth-related routes
		const authExcludeKeys = [
			'/',
			'/entrar',
			'/esqueci-senha',
			'/cadastrar',
		] as Href[];

		const publicMenuFiltered = PublicMenu.map((item) => {
			if (item.sections) {
				// Filter sections within the item
				const filteredSections = item.sections.filter(
					(section) => !authExcludeKeys.includes(section.key as Href),
				);
				return { ...item, sections: filteredSections };
			}
			// Filter top-level items
			return authExcludeKeys.includes(item.key as Href) ? null : item;
		}).filter(
			(item): item is Navigation =>
				item !== null && (!item.sections || item.sections.length > 0),
		);

		return [...AuthMenu, ...publicMenuFiltered];
	}

	return PublicMenu;
};

// Helper function to render a single menu item
const renderMenuItem = (
	item: Navigation,
	location: any,
	onTabClick?: () => void,
	badge?: string | number,
) => {
	const isSection = Boolean(item.sections?.length);

	return (
		<Tabs.Tab
			key={item.key || item.label}
			isDisabled={isSection}
			className="text-left data-[disabled=true]:cursor-default data-[disabled=true]:opacity-100"
			title={
				isSection ? (
					<Tabs.Menu label={item.label} isSection />
				) : (
					<Tabs.Menu
						label={item.label}
						isActive={item.key === location.href}
						icon={item.icon}
						badge={
							item.label === 'Avaliações' && badge && Number(badge) > 0
								? badge
								: undefined
						}
					/>
				)
			}
			href={item.href}
			onClick={() => {
				if (!isSection && onTabClick) {
					onTabClick();
				}
			}}
		/>
	);
};

type Props = {
	onTabClick?: () => void;
	isAuthenticated?: boolean;
};

export const MenuTabs = ({ onTabClick, isAuthenticated }: Props) => {
	const pathname = usePathname();
	const menuItems = getMenuItems(isAuthenticated ?? false);

	const flattenedItems: Navigation[] = [];

	menuItems.forEach((item) => {
		if (item.sections?.length) {
			flattenedItems.push(item);
			flattenedItems.push(...item.sections);
		} else {
			flattenedItems.push(item);
		}
	});

	if (!isAuthenticated) {
		return (
			<Tabs aria-label="tabs-menu-web" isMenu selectedKey={pathname}>
				{flattenedItems.map((item) =>
					renderMenuItem(item, pathname, onTabClick),
				)}
			</Tabs>
		);
	}

	const { reviews } = useReviews();
	const pendingReviews = reviews.results.filter(
		(review) => review.status === 'pending',
	);

	return (
		<Tabs aria-label="tabs-menu-web" isMenu selectedKey={pathname}>
			{flattenedItems.map((item) =>
				renderMenuItem(item, pathname, onTabClick, pendingReviews.length),
			)}
		</Tabs>
	);
};
