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
	isSection?: boolean;
	href?: NavigateOptions['to'] | undefined;
	search?: NavigateOptions['search'];
};

export const MenuDashboard: Navigation[] = [
	{
		key: '/dashboard',
		label: 'Dashboard',
		icon: 'Dashboard',
		href: '/{-$locale}/dashboard',
	},
	{
		label: 'Perfil',
		isSection: true,
		href: '/{-$locale}/dashboard/profile',
	},
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
];

export const MenuPublic: Navigation[] = [
	{
		key: '/',
		label: 'Home',
		href: '/{-$locale}',
	},
	{
		key: '/sign-in',
		label: 'Cadastre-se Gratuitamente',
		href: '/{-$locale}/sign-in',
	},
	{
		label: 'Informações',
		isSection: true,
		href: '/{-$locale}',
	},
	{
		key: '/terms-and-conditions',
		label: 'Termos e Condições',
		href: '/{-$locale}/terms-and-conditions',
	},
	{
		key: '/privacy-policy',
		label: 'Política de Privacidade',
		href: '/{-$locale}/privacy-policy',
	},
	{
		key: '/cookie-policy',
		label: 'Política de Cookies',
		href: '/{-$locale}/cookie-policy',
	},
];

export const MenuTabs = ({ onTabClick }: { onTabClick?: () => void }) => {
	const location = useLocation();
	const { profile } = useLoaderData({ from: '/{-$locale}' });

	return (
		<Tabs aria-label="tabs-menu-web" isMenu selectedKey={location.href}>
			{profile
				? MenuDashboard.map((item) => (
						<Tabs.Tab
							key={item.key}
							isDisabled={item.isSection}
							className={
								'data-[disabled=true]:cursor-default data-[disabled=true]:opacity-100'
							}
							title={
								item.isSection ? (
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
							routerOptions={{
								search: item.search,
							}}
							onClick={() => {
								if (!item.isSection && onTabClick) {
									onTabClick();
								}
							}}
						/>
					))
				: MenuPublic.map((item) => (
						<Tabs.Tab
							key={item.key}
							isDisabled={item.isSection}
							className={
								'data-[disabled=true]:cursor-default data-[disabled=true]:opacity-100'
							}
							title={
								item.isSection ? (
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
							routerOptions={{
								search: item.search,
							}}
							onClick={() => {
								if (!item.isSection && onTabClick) {
									onTabClick();
								}
							}}
						/>
					))}
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
					<Link to="/{-$locale}/dashboard">
						<Logo className="h-full cursor-pointer" />
					</Link>
				</div>

				<div className="flex items-center justify-end">
					{profile && (
						<Dropdown
							placement="bottom-end"
							backdrop="blur"
							classNames={{ backdrop: 'bg-black/20' }}
						>
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
									className="py-3 text-default-600"
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
									className="py-3 text-danger"
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
