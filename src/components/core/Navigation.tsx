import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { useSlot, useStyled } from 'use-styled';
import { cn } from '@/utils/cn';
import { Badge } from './Badge';
import { Icon } from './Icon';
import { Text } from './Text';

// Navigation Root
const NavigationRoot = useStyled('nav', {
	base: {
		className: cn('flex w-full flex-col gap-1'),
	},
});

// Navigation Item Button
const NavigationItemButton = useStyled('button', {
	base: {
		className: cn(
			'flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-text-secondary',
			'transition-all duration-200',
			'hover:bg-accent-10 hover:text-text-primary',
			'focus:outline-none',
		),
	},
	variants: {
		isOpen: {
			true: {
				className: cn('bg-accent-10 text-text-primary'),
			},
		},
	},
});

// Navigation Label
const NavigationLabel = useStyled(Text, {
	base: {
		as: 'span',
		className: cn('text-inherit'),
	},
});

// Navigation Arrow Icon
const NavigationArrowIcon = useStyled(Icon, {
	base: {
		name: 'ArrowDown',
		size: '16',
		className: cn('transition-transform duration-200'),
	},
	variants: {
		isOpen: {
			true: {
				className: cn('rotate-180'),
			},
		},
	},
});

// Navigation Content (for expandable items)
const NavigationContent = useStyled('div', {
	base: {
		className: cn('overflow-hidden transition-all duration-300 ease-in-out'),
		style: { height: '0px' },
	},
});

// Navigation Item Component
interface NavigationItemProps {
	label: string;
	children?: React.ReactNode;
	defaultOpen?: boolean;
	href?: string;
}

const NavigationItem = ({
	label,
	children,
	defaultOpen = false,
	href,
}: NavigationItemProps) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const contentRef = useRef<HTMLDivElement>(null);
	const isFirstRender = useRef(true);
	const hasChildren = !!children;

	// Smooth height animation
	useEffect(() => {
		if (!contentRef.current || !hasChildren) return;

		// Se é a primeira renderização e defaultOpen é true, define altura sem animação
		if (isFirstRender.current) {
			isFirstRender.current = false;
			if (isOpen) {
				contentRef.current.style.height = 'auto';
				return;
			}
			contentRef.current.style.height = '0px';
			return;
		}

		// Animação normal para mudanças subsequentes
		if (isOpen) {
			contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
			contentRef.current.getBoundingClientRect();
			const timer = setTimeout(() => {
				if (contentRef.current) {
					contentRef.current.style.height = 'auto';
				}
			}, 300);
			return () => clearTimeout(timer);
		}
		contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
		contentRef.current.getBoundingClientRect();
		requestAnimationFrame(() => {
			if (contentRef.current) {
				contentRef.current.style.height = '0px';
			}
		});
	}, [isOpen, hasChildren]);

	const handleClick = () => {
		if (hasChildren) {
			setIsOpen(!isOpen);
		} else if (href) {
			window.location.href = href;
		}
	};

	return (
		<div className="w-full">
			<NavigationItemButton isOpen={isOpen} onClick={handleClick}>
				<NavigationLabel>{label}</NavigationLabel>
				{hasChildren && <NavigationArrowIcon isOpen={isOpen} />}
			</NavigationItemButton>
			{hasChildren && (
				<NavigationContent ref={contentRef}>
					<div className="pt-2 pb-3 pl-4">{children}</div>
				</NavigationContent>
			)}
		</div>
	);
};

// SubMenu Root
const SubMenuRoot = useStyled('div', {
	base: {
		className: cn(
			'flex w-full flex-col gap-1 border-accent-10 border-l-2 pl-2',
		),
	},
});

// SubMenu Item Button
const SubMenuItemButton = useStyled('a', {
	base: {
		className: cn(
			'flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-text-secondary',
			'transition-all duration-200',
			'hover:bg-accent-10 hover:text-text-primary',
			'focus:outline-none',
		),
	},
	variants: {
		isActive: {
			true: {
				className: cn('bg-accent-10 text-text-primary'),
			},
		},
	},
});

type SubMenuItemProps = ComponentProps<typeof SubMenuItemButton> & {
	label: string;
	href?: string;
	badge?: string;
};

const SubMenuItem = ({ label, href, badge, ...props }: SubMenuItemProps) => {
	return (
		<SubMenuItemButton href={href} {...props}>
			<NavigationLabel>{label}</NavigationLabel>
			{badge && (
				<Badge colorScheme="primary" variant="filled">
					<Badge.Text>{badge}</Badge.Text>
				</Badge>
			)}
		</SubMenuItemButton>
	);
};

export const NavigationDivider = useStyled('div', {
	base: {
		className: cn('h-px w-full bg-accent-10'),
	},
});

// Create SubMenu compound component
const SubMenu = useSlot(SubMenuRoot, {
	Item: SubMenuItem,
	Divider: NavigationDivider,
});

// Create Navigation compound component
export const Navigation = useSlot(NavigationRoot, {
	Item: NavigationItem,
	SubMenu,
});

/**
 * How to use Navigation component:
 *
 * @example
 * // Simple navigation item with href
 * <Navigation>
 *   <Navigation.Item label="Home" href="/" />
 *   <Navigation.Item label="About" href="/about" />
 * </Navigation>
 *
 * @example
 * // Navigation with expandable items and sub-menus
 * <Navigation>
 *   <Navigation.Item label="Porto" defaultOpen>
 *     <Navigation.SubMenu>
 *       <Navigation.SubMenu.Item label="Porto" href="/" badge="10" />
 *       <Navigation.SubMenu.Item label="Vila Nova de Gaia" href="/" badge="5" />
 *       <Navigation.SubMenu.Item label="Matosinhos" href="/" />
 *     </Navigation.SubMenu>
 *   </Navigation.Item>
 *
 *   <Navigation.Item label="Lisboa">
 *     <Navigation.SubMenu>
 *       <Navigation.SubMenu.Item label="Lisboa" href="/" badge="3" />
 *       <Navigation.SubMenu.Item label="Cascais" href="/" badge="2" />
 *     </Navigation.SubMenu>
 *   </Navigation.Item>
 *
 *   <Navigation.Item label="Contact" href="/contact" />
 * </Navigation>
 *
 * @props
 * Navigation.Item:
 * - label: string (required) - Text to display
 * - href?: string - URL for navigation (only works without children)
 * - defaultOpen?: boolean - Start expanded (default: false)
 * - children?: ReactNode - SubMenu content
 *
 * Navigation.SubMenu.Item:
 * - label: string (required) - Text to display
 * - href?: string - URL for navigation
 * - badge?: string - Badge text to show
 * - isActive?: boolean - Active state
 */
