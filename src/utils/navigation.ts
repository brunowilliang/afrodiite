import { type NavigateOptions, useMatches } from '@tanstack/react-router';

type Navigation = {
	id: number;
	name: string;
	href?: NavigateOptions['to'];
	isSignOut?: boolean;
	isActive?: boolean;
};

export const links: Navigation[] = [
	{
		id: 1,
		name: 'Dashboard',
		href: '/{-$locale}/dashboard',
	},
	{
		id: 2,
		name: 'Anúncios',
		href: '/{-$locale}/dashboard/adverts',
	},
	{
		id: 3,
		name: 'Minha conta',
		href: '/{-$locale}/dashboard/my-account',
	},
	{
		id: 4,
		name: 'Configurações',
		href: '/{-$locale}/dashboard/settings',
	},
	{
		id: 5,
		name: 'Sair',
		isSignOut: true,
	},
];

export const useIsActiveRoute = (href: NavigateOptions['to']): boolean => {
	const matches = useMatches();

	const currentPath =
		matches[matches.length - 1]?.fullPath?.replace(/\/$/, '') || '';

	const normalizedHref = href?.replace(/\/$/, '') || '';

	return currentPath === normalizedHref;
};
