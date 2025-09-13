import { Navbar, NavbarMenu, NavbarMenuToggle } from '@heroui/react';
import {
	createFileRoute,
	NavigateOptions,
	Outlet,
	redirect,
	useLoaderData,
	useLocation,
} from '@tanstack/react-router';
import { useState } from 'react';
import { Icon, IconProps } from '@/components/core/Icon';
import { Logo } from '@/components/core/Logo';
import { Card } from '@/components/heroui/Card';
import { Dropdown } from '@/components/heroui/Dropdown';
import { Profile } from '@/components/heroui/Profile';
import { Tabs } from '@/components/heroui/Tabs';
import { api } from '@/lib/api';
import { tryCatch } from '@/utils/tryCatch';

export type Navigation = {
	key?: string;
	label?: string;
	icon?: IconProps['name'];
	isSection?: boolean;
	href?: NavigateOptions['to'] | undefined;
	search?: NavigateOptions['search'];
};

export const items: Navigation[] = [
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

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard')({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.session) {
			return redirect({ to: '/{-$locale}' });
		}
	},
	loader: async () => {
		const [profileError, profile] = await tryCatch(api.client.profile.get());

		if (profileError) {
			console.warn('Profile error in dashboard:', profileError.message);
			return { profile: null };
		}

		return { profile };
	},
	staleTime: 0,
});

const MenuTabs = ({ onTabClick }: { onTabClick?: () => void }) => {
	const location = useLocation();
	return (
		<Tabs aria-label="tabs-menu-web" isMenu selectedKey={location.href}>
			{items.map((item) => (
				<Tabs.Tab
					key={item.key}
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

function RouteComponent() {
	const navigate = Route.useNavigate();
	const { profile } = useLoaderData({ from: '/{-$locale}/(admin)/dashboard' });
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<section className="mx-auto flex min-h-screen max-w-5xl flex-col gap-5 overflow-visible px-4 pb-5">
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
							className="h-10 w-10 md:hidden"
							aria-label={'Toggle menu'}
						/>
						<Logo
							className="h-full cursor-pointer"
							onClick={() => navigate({ to: '/{-$locale}/dashboard' })}
						/>
					</div>

					<div className="flex items-center justify-end">
						<Dropdown
							placement="bottom-end"
							backdrop="blur"
							classNames={{
								backdrop: 'bg-black/20',
							}}
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
										navigate({
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
									endContent={<Icon name="Logout" size="20" />}
								>
									Fazer logout
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>
				</Card>

				<NavbarMenu className="mx-auto w-full max-w-5xl p-4 pt-5">
					<MenuTabs onTabClick={() => setIsMenuOpen(false)} />
				</NavbarMenu>
			</Navbar>
			<section className="mx-auto grid w-full max-w-5xl grid-cols-12 gap-5 overflow-visible">
				<div className="hidden md:col-span-3 md:block">
					<MenuTabs />
				</div>

				<Card
					className="col-span-full min-h-[calc(100vh-110px-20px)] overflow-visible bg-default/10 p-4 md:col-span-9"
					shadow="none"
				>
					<Outlet />
				</Card>
			</section>
		</section>
	);
}
