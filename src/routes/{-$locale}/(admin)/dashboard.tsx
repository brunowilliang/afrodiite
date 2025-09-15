import {
	createFileRoute,
	NavigateOptions,
	Outlet,
	redirect,
} from '@tanstack/react-router';
import { Header, MenuTabs } from '@/components/core/Header';
import { IconProps } from '@/components/core/Icon';
import { Card } from '@/components/heroui/Card';

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
});

function RouteComponent() {
	return (
		<section className="mx-auto flex min-h-screen max-w-5xl flex-col gap-5 overflow-visible px-4 pb-5">
			<Header />
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
