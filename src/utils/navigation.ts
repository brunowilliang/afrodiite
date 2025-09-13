import { type NavigateOptions, useMatches } from '@tanstack/react-router';

type Options = {
	key: string;
	label: string;
	href?: NavigateOptions['to'];
	search?: NavigateOptions['search'];
	isSignOut?: boolean;
	isActive?: boolean;
};

export type Navigation = {
	key: string;
	label: string;
	href?: NavigateOptions['to'];
	search?: NavigateOptions['search'];
	isSignOut?: boolean;
	isActive?: boolean;
	subMenu?: Options[];
};

export const links: Navigation[] = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		href: '/{-$locale}/dashboard',
	},
	{
		key: 'profile',
		label: 'Perfil',
		href: '/{-$locale}/dashboard/profile',
		subMenu: [
			{
				key: 'information',
				label: 'Informações',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'information' },
			},
			{
				key: 'location',
				label: 'Localização',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'location' },
			},
			{
				key: 'characteristics',
				label: 'Características',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'characteristics' },
			},
			{
				key: 'schedule',
				label: 'Horários',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'schedule' },
			},
			{
				key: 'prices',
				label: 'Preços',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'prices' },
			},
			{
				key: 'services',
				label: 'Serviços',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'services' },
			},
			{
				key: 'gallery',
				label: 'Imagens',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'gallery' },
			},
		],
	},
	{
		key: 'adverts',
		label: 'Anúncios',
		href: '/{-$locale}/dashboard/adverts',
	},
	{
		key: 'my-account',
		label: 'Minha conta',
		href: '/{-$locale}/dashboard/my-account',
	},
	{
		key: 'settings',
		label: 'Configurações',
		href: '/{-$locale}/dashboard/settings',
	},
	{
		key: 'sign-out',
		label: 'Sair',
		isSignOut: true,
	},
];

export const useIsActiveRoute = (
	href: NavigateOptions['to'],
	search?: NavigateOptions['search'],
): boolean => {
	const matches = useMatches();
	const currentMatch = matches[matches.length - 1];

	if (!currentMatch) return false;

	// Compara o path
	const currentPath = currentMatch.fullPath?.replace(/\/$/, '') || '';
	const normalizedHref = href?.replace(/\/$/, '') || '';

	const pathMatches = currentPath === normalizedHref;

	// Se não há search params para comparar, retorna apenas a comparação do path
	if (!search) return pathMatches;

	// Se há search params, compara também eles
	if (!pathMatches) return false;

	const currentSearch = currentMatch.search || {};

	// Verifica se todos os search params da navegação estão presentes e iguais
	return Object.entries(search).every(([key, value]) => {
		return (currentSearch as Record<string, any>)[key] === value;
	});
};
