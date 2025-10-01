import { Tab as HeroTab, Tabs as HeroTabs } from '@heroui/react';
import { useSlot, useStyled } from 'use-styled';
import { Icon, IconProps } from '@/components/core/Icon';
import { Badge } from './Badge';

const TabsRoot = useStyled(HeroTabs, {
	base: {
		variant: 'solid',
		classNames: {
			tabList: 'relative gap-1 rounded-none rounded-xl bg-default/10 p-1',
			cursor: 'w-full bg-primary/10! shadow-none',
			tab: 'w-full justify-start px-3 py-5',
			tabContent: 'group-data-[selected=true]:text-primary-600',
		},
	},
	variants: {
		isMenu: {
			true: {
				isVertical: true,
				fullWidth: true,
				classNames: {
					tabList: 'relative gap-1 rounded-none rounded-xl bg-default-50 p-1.5',
					cursor: 'z-1000 w-full bg-primary/10! shadow-none',
					tab: 'w-full justify-start px-3 py-5',
					tabContent: 'w-full group-data-[selected=true]:text-primary-600',
				},
			},
		},
	},
});

type MenuProps = {
	label?: string;
	isActive?: boolean;
	isSection?: boolean;
	icon?: IconProps['name'];
	badge?: string | number;
};

export const MenuItem = ({
	label,
	isActive,
	icon,
	isSection,
	badge,
}: MenuProps) => {
	return isSection ? (
		<span className="text-default-400 text-small">{label}</span>
	) : (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<Icon name={icon} size="18" variant={isActive ? 'bulk' : 'stroke'} />
				<span>{label}</span>
			</div>
			{badge && (
				<div className="flex items-center gap-2">
					<Badge size="sm" className="py-1">
						{badge}
					</Badge>
				</div>
			)}
		</div>
	);
};

export const Tabs = useSlot(TabsRoot, {
	Tab: HeroTab,
	Menu: MenuItem,
});
