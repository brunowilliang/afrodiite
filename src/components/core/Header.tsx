import { Navbar, NavbarMenu, NavbarMenuToggle } from '@heroui/react';
import {
	Link,
	NavigateOptions,
	useLoaderData,
	useLocation,
	useRouter,
} from '@tanstack/react-router';
import { useState } from 'react';
import { Icon, IconProps } from '@/components/core/Icon';
import { Logo } from '@/components/core/Logo';
import { Hamburger } from '@/components/Hamburger';
import { Card } from '@/components/heroui/Card';
import { Dropdown } from '@/components/heroui/Dropdown';
import { Profile } from '@/components/heroui/Profile';
import { Tabs } from '@/components/heroui/Tabs';
import { api } from '@/lib/api';

export type Navigation = {
	key?: string;
	label?: string;
	icon?: IconProps['name'];
	href?: NavigateOptions['to'] | undefined;
	search?: NavigateOptions['search'];
	sections?: Navigation[]; // If has sections, it's a section header
};

export const AuthMenu: Navigation[] = [
	{
		key: '/dashboard',
		label: 'Dashboard',
		icon: 'Dashboard',
		href: '/{-$locale}/dashboard',
	},
	{
		label: 'Perfil',
		sections: [
			{
				key: '/dashboard/profile?tab=information',
				label: 'Informações',
				icon: 'Profile',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'information' },
			},
			{
				key: '/dashboard/profile?tab=location',
				label: 'Localização',
				icon: 'Location',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'location' },
			},
			{
				key: '/dashboard/profile?tab=characteristics',
				label: 'Características',
				icon: 'Diamond',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'characteristics' },
			},
			{
				key: '/dashboard/profile?tab=schedule',
				label: 'Horários',
				icon: 'ClockSquare',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'schedule' },
			},
			{
				key: '/dashboard/profile?tab=prices',
				label: 'Preços',
				icon: 'MoneyBag',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'prices' },
			},
			{
				key: '/dashboard/profile?tab=services',
				label: 'Serviços',
				icon: 'Services',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'services' },
			},
			{
				key: '/dashboard/profile?tab=gallery',
				label: 'Imagens',
				icon: 'Gallery',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'gallery' },
			},
			{
				key: '/dashboard/reviews',
				label: 'Avaliações',
				icon: 'Reviews',
				href: '/{-$locale}/dashboard/reviews',
			},
		],
	},
	{
		label: 'Geral',
		sections: [
			{
				key: '/dashboard/settings',
				label: 'Configurações',
				icon: 'Settings',
				href: '/{-$locale}/dashboard/settings',
			},
		],
	},
];

export const PublicMenu: Navigation[] = [
	{
		key: '/',
		label: 'Home',
		icon: 'Home',
		href: '/{-$locale}',
	},
	{
		key: '/sign-in',
		label: 'Cadastre-se Gratuitamente',
		icon: 'User',
		href: '/{-$locale}/sign-in',
	},
	{
		label: 'Informações',
		sections: [
			{
				key: '/terms-and-conditions',
				label: 'Termos e Condições',
				icon: 'Services',
				href: '/{-$locale}/terms-and-conditions',
			},
			{
				key: '/privacy-policy',
				label: 'Política de Privacidade',
				icon: 'Services',
				href: '/{-$locale}/privacy-policy',
			},
			{
				key: '/cookie-policy',
				label: 'Política de Cookies',
				icon: 'Services',
				href: '/{-$locale}/cookie-policy',
			},
		],
	},
];

// Helper function to get menu items based on authentication status
const getMenuItems = (profile: any): Navigation[] => {
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
					/>
				)
			}
			href={item.href}
			routerOptions={{ search: item.search }}
			onClick={() => {
				if (!isSection && onTabClick) {
					onTabClick();
				}
			}}
		/>
	);
};

export const MenuTabs = ({ onTabClick }: { onTabClick?: () => void }) => {
	const location = useLocation();
	const { profile } = useLoaderData({ from: '/{-$locale}' });

	const menuItems = getMenuItems(profile);

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
		<Tabs aria-label="tabs-menu-web" isMenu selectedKey={location.href}>
			{flattenedItems.map((item) => renderMenuItem(item, location, onTabClick))}
		</Tabs>
	);
};

export const Header = () => {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const { profile } = useLoaderData({ from: '/{-$locale}' });

	const signOut = async () => {
		await api.auth.signOut();
		await router.invalidate({ sync: true });
	};

	return (
		<Navbar
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}
			height={90}
			classNames={{
				wrapper: 'items-end px-0',
			}}
		>
			<Card
				className="flex h-[calc(90px-20px)] w-full flex-row items-center justify-between bg-default/10 px-3"
				shadow="none"
			>
				<div className="centered flex gap-2">
					<NavbarMenuToggle
						icon={(isOpen) => {
							return <Hamburger isOpen={isOpen} />;
						}}
						className="h-10 w-10 text-default-600 md:hidden"
						aria-label={'Toggle menu'}
					/>
					<Link to="/{-$locale}/dashboard" onClick={() => setIsMenuOpen(false)}>
						<Logo className="h-full cursor-pointer" />
					</Link>
				</div>

				<div className="flex items-center justify-end">
					{profile && (
						<Dropdown placement="bottom-end" backdrop="opaque">
							<Dropdown.Trigger>
								<Profile
									name={profile?.artist_name ?? ''}
									description="Acompanhante"
									avatar={profile?.gallery?.[0]?.url ?? ''}
								/>
							</Dropdown.Trigger>
							<Dropdown.Menu>
								<Dropdown.Item
									key="ver-perfil"
									color="default"
									className="px-3 py-2.5 text-default-600 data-[disabled=true]:opacity-40"
									endContent={<Icon name="Link" size="20" />}
									onPress={() => {
										router.navigate({
											to: '/{-$locale}/escort/$public_id/{-$slug}',
											replace: true,
											params: {
												public_id: profile?.public_id?.toString() ?? '',
											},
										});
									}}
								>
									Ver perfil
								</Dropdown.Item>
								<Dropdown.Item
									key="fazer-logout"
									color="danger"
									className="px-3 py-2.5 text-danger data-[disabled=true]:opacity-40"
									onPress={() => signOut()}
									endContent={<Icon name="Logout" size="20" />}
								>
									Fazer logout
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					)}
				</div>
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
				className="mx-auto w-full max-w-5xl p-4 pt-5"
			>
				<MenuTabs onTabClick={() => setIsMenuOpen(false)} />
			</NavbarMenu>
		</Navbar>
	);
};
