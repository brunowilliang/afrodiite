'use client';

import { Tabs } from '@/components/core/Tabs';
import { Navigation } from '@/components/Header/links';

type MenuItemProps = {
	item: Navigation;
	location: any;
	onTabClick?: () => void;
	badge?: string | number;
};

export const renderMenuItem = ({
	item,
	location,
	onTabClick,
	badge,
}: MenuItemProps) => {
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
