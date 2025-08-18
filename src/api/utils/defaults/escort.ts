import type { Characteristics, OfficeHour, Price } from '../types/escort';

export const DEFAULT_OFFICE_HOURS: OfficeHour[] = [
	{
		day: 'monday',
		is_available: false,
		start: '00:00',
		end: '23:59',
	},
	{
		day: 'tuesday',
		is_available: false,
		start: '00:00',
		end: '23:59',
	},
	{
		day: 'wednesday',
		is_available: false,
		start: '00:00',
		end: '23:59',
	},
	{
		day: 'thursday',
		is_available: false,
		start: '00:00',
		end: '23:59',
	},
	{
		day: 'friday',
		is_available: false,
		start: '00:00',
		end: '23:59',
	},
	{
		day: 'saturday',
		is_available: false,
		start: '00:00',
		end: '23:59',
	},
	{
		day: 'sunday',
		is_available: false,
		start: '00:00',
		end: '23:59',
	},
];

export const DEFAULT_PRICES: Price[] = [
	{
		slot: '30m',
		is_available: false,
		amount: 0,
		currency: 'EUR',
	},
	{
		slot: '1h',
		is_available: false,
		amount: 0,
		currency: 'EUR',
	},
	{
		slot: '2h',
		is_available: false,
		amount: 0,
		currency: 'EUR',
	},
	{
		slot: '4h',
		is_available: false,
		amount: 0,
		currency: 'EUR',
	},
	{
		slot: 'overnight',
		is_available: false,
		amount: 0,
		currency: 'EUR',
	},
	{
		slot: 'daily',
		is_available: false,
		amount: 0,
		currency: 'EUR',
	},
	{
		slot: 'travel_daily',
		is_available: false,
		amount: 0,
		currency: 'EUR',
	},
];

export const DEFAULT_CHARACTERISTICS: Characteristics = {
	gender: '',
	age: 0,
	height: 0,
	weight: 0,
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

export const DAYS = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday',
] as const;

export const SLOTS = [
	'30m',
	'1h',
	'2h',
	'4h',
	'overnight',
	'daily',
	'travel_daily',
] as const;
