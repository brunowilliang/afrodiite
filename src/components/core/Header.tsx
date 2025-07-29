import type { ComponentProps } from 'react';
import { useSlot, useStyled } from 'use-styled';
import { Icon as IconComponent } from '@/components/core/Icon';
import { Stack } from '@/components/core/Stack';
import { Badge } from './Badge';
import { Text } from './Text';

const NavItemRoot = useStyled(Stack, {
	base: {
		direction: 'row',
		className:
			'items-center justify-between rounded-lg px-3 py-2 text-text-secondary',
	},
	variants: {
		isSubMenu: {
			true: {
				className: 'pr-1 pl-4',
			},
		},
		isActive: {
			true: {
				className:
					'group is-active bg-accent-10 font-normal text-text-primary transition-colors duration-300',
			},
		},
	},
});

type NavItemProps = ComponentProps<typeof NavItemRoot> & {
	label?: string;
	badge?: string;
};

const NavItemComponent = ({ label, badge, ...props }: NavItemProps) => {
	return (
		<NavItemRoot {...props}>
			<Text
				as="p"
				color={
					props.isSubMenu
						? 'textPrimary'
						: props.isActive
							? 'textPrimary'
							: 'textSecondary'
				}
			>
				{label}
			</Text>
			{badge && (
				<Badge>
					<Badge.Text>{badge}</Badge.Text>
				</Badge>
			)}
			{!props.isSubMenu && <IconComponent name="ArrowDown" size={'20'} />}
		</NavItemRoot>
	);
};

const HeaderRoot = useStyled(Stack, {
	base: {
		className:
			'fixed top-0 z-50 w-full gap-4 bg-gradient-to-b from-background via-background/90 to-background/0 px-4 pt-4',
	},
});

const Container = useStyled(Stack, {
	base: {
		container: true,
		direction: 'row',
		as: 'div',
		className:
			'max-w-[1440px] gap-4 overflow-hidden rounded-xl border border-accent-10 bg-accent px-4 py-4 text-text-primary',
	},
	variants: {
		isHeader: {
			true: {
				className: 'h-[70px] items-center justify-between',
			},
		},
	},
});

const NavRoot = useStyled(Stack, {
	base: {
		className: 'gap-1',
	},
});

const SubMenuRoot = useStyled(Stack, {
	base: {
		className: 'my-2 ml-3 border-accent-10 border-l',
	},
});

const SubMenu = useSlot(SubMenuRoot, {
	Item: useStyled(NavItemComponent, {
		base: {
			isSubMenu: true,
		},
	}),
});

const Navigation = useSlot(NavRoot, {
	Item: NavItemComponent,
	SubMenu,
});

export const Header = useSlot(HeaderRoot, {
	Container,
	Icon: IconComponent,
	Navigation,
});
