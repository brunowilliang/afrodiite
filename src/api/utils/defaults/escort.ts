// Domínios
export const DAYS = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday',
] as const;
export type Day = (typeof DAYS)[number];

export const SLOTS = [
	'30m',
	'1h',
	'2h',
	'4h',
	'overnight',
	'daily',
	'travel_daily',
] as const;
export type Slot = (typeof SLOTS)[number];

// Office hours como array
export type OfficeHour = {
	day: Day;
	is_available: boolean;
	start: string;
	end: string;
};

export const DEFAULT_OFFICE_HOURS: OfficeHour[] = [
	{
		day: 'monday',
		is_available: true,
		start: '00:00',
		end: '23:59',
	},
	{
		day: 'tuesday',
		is_available: true,
		start: '00:00',
		end: '23:59',
	},
	{
		day: 'wednesday',
		is_available: true,
		start: '00:00',
		end: '23:59',
	},
	{
		day: 'thursday',
		is_available: true,
		start: '00:00',
		end: '23:59',
	},
	{
		day: 'friday',
		is_available: true,
		start: '00:00',
		end: '23:59',
	},
	{
		day: 'saturday',
		is_available: true,
		start: '00:00',
		end: '23:59',
	},
	{
		day: 'sunday',
		is_available: true,
		start: '00:00',
		end: '23:59',
	},
];

// Prices como array
export type Price = {
	slot: Slot;
	is_available: boolean;
	amount?: number;
	currency?: 'EUR';
};

export const DEFAULT_PRICES: Price[] = [
	{
		slot: '30m',
		is_available: true,
		amount: 0,
		currency: 'EUR',
	},
	{
		slot: '1h',
		is_available: true,
		amount: 0,
		currency: 'EUR',
	},
	{
		slot: '2h',
		is_available: true,
		amount: 0,
		currency: 'EUR',
	},
	{
		slot: '4h',
		is_available: true,
		amount: 0,
		currency: 'EUR',
	},
	{
		slot: 'overnight',
		is_available: true,
		amount: 0,
		currency: 'EUR',
	},
	{
		slot: 'daily',
		is_available: true,
		amount: 0,
		currency: 'EUR',
	},
	{
		slot: 'travel_daily',
		is_available: true,
		amount: 0,
		currency: 'EUR',
	},
];

export const DEFAULT_CHARACTERISTICS = {
	gender: '',
	age: '',
	height: '',
	weight: '',
	hair_color: '',
	eye_color: '',
	sexual_preference: '',
	ethnicity: '',
	silicone: false,
	tattoos: false,
	piercings: false,
	smoker: false,
	languages: '',
};

export type GalleryItem = {
	id: string;
	path: string;
	url: string;
	size: number;
	width: number;
	height: number;
	order: number;
	createdAt: string;
};

export type Characteristics = typeof DEFAULT_CHARACTERISTICS;
