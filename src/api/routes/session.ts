import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import z from 'zod';
import { auth } from '@/api/lib/auth';
import { polar } from '../lib/polar';

export const getSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		const request = getWebRequest();
		const session = await auth.api.getSession({ headers: request.headers });

		return { session: session ?? null };
	},
);

export const openPortal = createServerFn({ method: 'GET' })
	.validator(
		z.object({
			customerId: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const result = await polar.customerSessions.create({
			customerId: data.customerId,
		});

		return result;
	});
