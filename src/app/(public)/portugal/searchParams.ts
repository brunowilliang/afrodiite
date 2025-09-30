import { createLoader, parseAsInteger, parseAsString } from 'nuqs/server';

export const searchParams = {
	page: parseAsInteger.withDefault(1),
	search: parseAsString.withDefault(''),
};

export const loadParams = createLoader(searchParams);
