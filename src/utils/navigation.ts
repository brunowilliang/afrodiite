import { type NavigateOptions, useMatches } from '@tanstack/react-router';

type Options = {
	id: number;
	name: string;
	href?: NavigateOptions['to'];
	search?: NavigateOptions['search'];
	isSignOut?: boolean;
	isActive?: boolean;
};

type Navigation = {
	id: number;
	name: string;
	href?: NavigateOptions['to'];
	isSignOut?: boolean;
	isActive?: boolean;
	subMenu?: Options[];
};

export const links: Navigation[] = [
	{
		id: 1,
		name: 'Dashboard',
		href: '/{-$locale}/dashboard',
	},
	{
		id: 2,
		name: 'Perfil',
		href: '/{-$locale}/dashboard/profile',
		subMenu: [
			{
				id: 1,
				name: 'Informações',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'information' },
			},
			{
				id: 2,
				name: 'Localização',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'location' },
			},
			{
				id: 3,
				name: 'Características',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'characteristics' },
			},
			{
				id: 4,
				name: 'Horários',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'schedule' },
			},
			{
				id: 5,
				name: 'Preços',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'prices' },
			},
			{
				id: 6,
				name: 'Serviços',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'services' },
			},
			{
				id: 7,
				name: 'Imagens',
				href: '/{-$locale}/dashboard/profile',
				search: { tab: 'gallery' },
			},
		],
	},
	{
		id: 3,
		name: 'Anúncios',
		href: '/{-$locale}/dashboard/adverts',
	},
	{
		id: 4,
		name: 'Minha conta',
		href: '/{-$locale}/dashboard/my-account',
	},
	{
		id: 5,
		name: 'Configurações',
		href: '/{-$locale}/dashboard/settings',
	},
	{
		id: 6,
		name: 'Sair',
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
