'use client';

import { Navbar, NavbarMenu, NavbarMenuToggle } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Card } from '@/components/core/Card';
import { IconProps } from '@/components/core/Icon';
import { Link } from '@/components/core/Link';
import { Tabs } from '@/components/core/Tabs';
import { UserProfile } from '@/components/Header/UserProfile';
import { Logo } from '@/components/Logo';
import { Href } from '@/providers/HeroUIProvider';

export type Navigation = {
	key?: Href;
	label?: string;
	icon?: IconProps['name'];
	href?: Href;
	sections?: Navigation[];
};

export const AuthMenu: Navigation[] = [
	{
		key: '/painel',
		href: '/painel',
		label: 'Dashboard',
		icon: 'Dashboard',
	},
	{
		label: 'Perfil',
		sections: [
			{
				key: '/perfil',
				href: '/perfil',
				label: 'Informações',
				icon: 'Profile',
			},
			{
				key: '/perfil/localizacao',
				href: '/perfil/localizacao',
				label: 'Localização',
				icon: 'Location',
			},
			{
				key: '/perfil/caracteristicas',
				href: '/perfil/caracteristicas',
				label: 'Características',
				icon: 'Diamond',
			},
			{
				key: '/perfil/horarios',
				href: '/perfil/horarios',
				label: 'Horários',
				icon: 'ClockSquare',
			},
			{
				key: '/perfil/precos',
				href: '/perfil/precos',
				label: 'Preços',
				icon: 'MoneyBag',
			},
			{
				key: '/perfil/servicos',
				href: '/perfil/servicos',
				label: 'Serviços',
				icon: 'Services',
			},
			{
				key: '/perfil/galeria',
				href: '/perfil/galeria',
				label: 'Imagens',
				icon: 'Gallery',
			},
			{
				key: '/perfil/avaliacoes',
				href: '/perfil/avaliacoes',
				label: 'Avaliações',
				icon: 'Reviews',
			},
		],
	},
	{
		label: 'Geral',
		sections: [
			{
				key: '/ajustes',
				href: '/ajustes',
				label: 'Configurações',
				icon: 'Settings',
			},
		],
	},
];

export const PublicMenu: Navigation[] = [
	{
		key: '/',
		href: '/',
		label: 'Home',
		icon: 'Home',
	},
	{
		key: '/cadastrar',
		href: '/cadastrar',
		label: 'Cadastre-se Gratuitamente',
		icon: 'User',
	},
	{
		label: 'Informações',
		sections: [
			{
				key: '/',
				href: '/',
				label: 'Termos e Condições',
				icon: 'Services',
			},
			{
				key: '/',
				href: '/',
				label: 'Política de Privacidade',
				icon: 'Services',
			},
			{
				key: '/',
				href: '/',
				label: 'Política de Cookies',
				icon: 'Services',
			},
		],
	},
];

// Helper function to get menu items based on authentication status
const getMenuItems = (profile: boolean): Navigation[] => {
	if (profile) {
		// User is authenticated: show dashboard + filtered public menu (remove sign-in)
		// const publicMenuFiltered = PublicMenu.filter(
		// 	(item) => item.key !== '/sign-in',
		// );
		return [...AuthMenu];
		// return [...AuthMenu, ...publicMenuFiltered];
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

export const MenuTabs = ({ onTabClick }: { onTabClick?: () => void }) => {
	const pathname = usePathname();

	const menuItems = getMenuItems(true);

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
};

type Props = {
	profile?: IProfile.Select;
};

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
						className="h-10 w-10 text-default-600 md:hidden"
						aria-label={'Toggle menu'}
					/>
					<Link href="/painel" onClick={() => setIsMenuOpen(false)}>
						<Logo className="h-full cursor-pointer" />
					</Link>
				</div>
				<UserProfile profile={profile} />
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
				<MenuTabs onTabClick={() => setIsMenuOpen(false)} />
			</NavbarMenu>
		</Navbar>
	);
};
