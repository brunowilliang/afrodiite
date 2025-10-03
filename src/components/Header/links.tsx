import { IconProps } from '@/components/core/Icon';
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
		label: 'Site',
		sections: [
			{
				key: '/',
				href: '/',
				label: 'Home',
				icon: 'Home',
			},
			{
				key: '/cadastrar',
				href: '/cadastrar',
				label: 'Cadastre-se',
				icon: 'User',
			},
		],
	},
	{
		label: 'Informações',
		sections: [
			{
				key: '/termos-e-condicoes',
				href: '/termos-e-condicoes',
				label: 'Termos e Condições',
				icon: 'Services',
			},
			{
				key: '/politica-de-privacidade',
				href: '/politica-de-privacidade',
				label: 'Política de Privacidade',
				icon: 'Services',
			},
			{
				key: '/politica-de-cookies',
				href: '/politica-de-cookies',
				label: 'Política de Cookies',
				icon: 'Services',
			},
		],
	},
];
