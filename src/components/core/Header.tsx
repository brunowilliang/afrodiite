'use client';

import { Navbar, NavbarMenu, NavbarMenuToggle } from '@heroui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Card } from '@/components/core/Card';
// import { Link } from '@/components/core/Link';
import { Tabs } from '@/components/core/Tabs';
import { AuthMenu, Navigation, PublicMenu } from '@/components/Header/Links';
import { UserProfile } from '@/components/Header/UserProfile';
import { Logo } from '@/components/Logo';
import { Href } from '@/providers/HeroUIProvider';

// Helper function to get menu items based on authentication status
const getMenuItems = (showAuthMenu: boolean): Navigation[] => {
	if (showAuthMenu) {
		// Filter items to exclude auth-related routes
		const authExcludeKeys = [
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

	// User is not authenticated: show only public menu
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
	const router = useRouter();

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
	profile?: IProfile.Select;
	showAuthMenu?: boolean;
	onTabClick?: () => void;
};

export function MenuTabs({ showAuthMenu, onTabClick }: Props) {
	const pathname = usePathname();

	const menuItems = getMenuItems(Boolean(showAuthMenu));

	const flattenedItems: Navigation[] = [];

	menuItems.forEach((item) => {
		if (item.sections?.length) {
			// Add section header
			flattenedItems.push(item);
			// Add section items
			flattenedItems.push(...item.sections);
		} else {
			// Add regular item
			flattenedItems.push(item);
		}
	});

	return (
		<Tabs aria-label="tabs-menu-web" isMenu selectedKey={pathname}>
			{flattenedItems.map(
				(item) => renderMenuItem(item, pathname, onTabClick),
				// renderMenuItem(item, location, onTabClick, pendingReviews.length),
			)}
		</Tabs>
	);
}

export const Header = ({ profile }: Props) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<Navbar
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}
			height={90}
			className="bg-transparent"
			classNames={{
				wrapper: 'items-end px-0 bg-transparent',
			}}
		>
			<Card
				className="flex h-[calc(90px-20px)] w-full flex-row items-center justify-between bg-default/10 px-3"
				shadow="none"
			>
				<div className="centered flex gap-2">
					<NavbarMenuToggle
						className="h-10 w-10 text-default-600"
						aria-label={'Toggle menu'}
					/>
					<Link href="/painel" onClick={() => setIsMenuOpen(false)}>
						<Logo className="h-full cursor-pointer" />
					</Link>
				</div>
				{profile ? (
					<UserProfile profile={profile} />
				) : (
					<Link href="/entrar" onClick={() => setIsMenuOpen(false)}>
						Entar
					</Link>
				)}
			</Card>

			<NavbarMenu
				motionProps={{
					initial: {
						opacity: 0,
						transform: 'translateY(-100%)',
					},
					animate: {
						opacity: 1,
						transform: 'translateY(0)',
					},
					exit: {
						opacity: 0,
						transform: 'translateY(-100%)',
					},
					transition: {
						type: 'tween',
						duration: 0.4,
						ease: 'easeInOut',
					},
				}}
				className="mx-auto w-full max-w-5xl bg-tranparent p-4 pt-5"
			>
				<MenuTabs
					showAuthMenu={Boolean(profile)}
					onTabClick={() => setIsMenuOpen(false)}
				/>
			</NavbarMenu>
		</Navbar>
	);
};
