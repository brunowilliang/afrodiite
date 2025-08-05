export const Prices = [
	{
		id: 1,
		label: '1 hora',
		price: 120,
		available: true,
	},
	{
		id: 2,
		label: '2 horas',
		price: 200,
		available: true,
	},
	{
		id: 3,
		label: '4 horas',
		price: 350,
		available: true,
	},
	{
		id: 4,
		label: 'Pernoite',
		price: 1000,
		available: true,
	},
	{
		id: 5,
		label: '15 minutos',
		price: null,
		available: false,
	},
	{
		id: 6,
		label: '30 minutos',
		price: null,
		available: false,
	},
	{
		id: 7,
		label: 'Viagem',
		price: null,
		available: false,
	},
];

export const Characteristics = [
	{
		id: 1,
		label: 'Idade',
		value: '20 anos',
	},
	{
		id: 2,
		label: 'Altura',
		value: '1.70m',
	},
	{
		id: 3,
		label: 'Peso',
		value: '61kg',
	},
	{
		id: 4,
		label: 'Idiomas',
		value: 'Português, Inglês',
	},
	{
		id: 5,
		label: 'Etnia',
		value: 'Branca',
	},
	{
		id: 6,
		label: 'Nacionalidade',
		value: 'Brasileira',
	},
	{
		id: 7,
		label: 'Tamanho do pé',
		value: '39',
	},
	{
		id: 8,
		label: 'Tatuagens',
		value: 'Não',
	},
	{
		id: 9,
		label: 'Cores de olhos',
		value: 'Castanhos',
	},
	{
		id: 10,
		label: 'Fumante',
		value: 'Não',
	},
];

export const AvailableWeekHours = [
	{
		id: 1,
		label: 'Segunda-feira',
		value: '10:00 - 18:00',
		available: true,
	},
	{
		id: 2,
		label: 'Terça-feira',
		value: '10:00 - 18:00',
		available: true,
	},
	{
		id: 3,
		label: 'Quarta-feira',
		value: '10:00 - 18:00',
		available: true,
	},
	{
		id: 4,
		label: 'Quinta-feira',
		value: '10:00 - 18:00',
		available: true,
	},
	{
		id: 5,
		label: 'Sexta-feira',
		value: '10:00 - 18:00',
		available: true,
	},
	{
		id: 6,
		label: 'Sábado',
		value: '10:00 - 18:00',
		available: true,
	},
	{
		id: 7,
		label: 'Domingo',
		value: '10:00 - 18:00',
		available: false,
	},
];

export const Fetishes = [
	{
		id: 1,
		value: 'Podolatria',
		description:
			'Lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
	},
	{
		id: 2,
		value: 'Roleplay',
		description:
			'Lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
	},
	{
		id: 3,
		value: 'BDSM',
		description:
			'Lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
	},
	{
		id: 4,
		value: 'Voyeurismo',
		description:
			'Lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
	},
	{
		id: 5,
		value: 'Spanking',
		description:
			'Lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
	},
	{
		id: 6,
		value: 'Fetish',
		description:
			'Lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
	},
];

export const AvailableServices = [
	{
		id: 1,
		value: 'Sexo anal com preservativo',
		available: true,
	},
	{
		id: 2,
		value: 'Sexo vaginal com preservativo',
		available: true,
	},
	{
		id: 3,
		value: 'Sexo oral com preservativo',
		available: true,
	},
	{
		id: 4,
		value: 'Massagem erótica',
		available: true,
	},
	{
		id: 5,
		value: 'Striptease',
		available: true,
	},
	{
		id: 6,
		value: 'Beijo na boca',
		available: true,
	},
	{
		id: 7,
		value: 'Chamada de vídeo',
		available: true,
	},
];

export const NavigationMenu = [
	{
		id: 1,
		name: 'Porto',
		href: '/escorts',
		cities: [
			{ id: 1, name: 'Porto', href: '/escorts', badge: '10' },
			{ id: 2, name: 'Vila Nova de Gaia', href: '/', badge: '10' },
			{ id: 3, name: 'Matosinhos', href: '/', badge: '10' },
		],
	},
	{
		id: 2,
		name: 'Lisboa',
		href: '/',
		cities: [
			{ id: 1, name: 'Lisboa', href: '/', badge: '10' },
			{ id: 2, name: 'Vila Nova de Lisboa', href: '/', badge: '10' },
			{ id: 3, name: 'Cascais', href: '/', badge: '10' },
		],
	},
	{
		id: 3,
		name: 'Algarve',
		href: '/',
		cities: [
			{ id: 1, name: 'Albufeira', href: '/', badge: '10' },
			{ id: 2, name: 'Faro', href: '/', badge: '10' },
			{ id: 3, name: 'Portimão', href: '/', badge: '10' },
		],
	},
	{
		id: 4,
		name: 'Braga',
		href: '/',
		cities: [
			{ id: 1, name: 'Braga', href: '/', badge: '10' },
			{ id: 3, name: 'Guimarães', href: '/', badge: '10' },
		],
	},
];

export const DashboardMenu = [
	{
		id: 1,
		name: 'Dashboard',
	},
	{
		id: 2,
		name: 'Anúncios',
	},
	{
		id: 3,
		name: 'Minha conta',
	},
	{
		id: 4,
		name: 'Configurações',
	},
	{
		id: 5,
		name: 'Sair',
	},
];
