import { Checkout } from '@polar-sh/tanstack-start';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { env } from '@/lib/env';

export const ServerRoute = createServerFileRoute('/api/checkout').methods({
	GET: Checkout({
		accessToken: env.POLAR_ACCESS_TOKEN_SANDBOX,
		successUrl: '/checkout/success',
		server: 'sandbox', // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
		theme: 'dark', // Enforces the theme - System-preferred theme will be set if left omitted
	}),
});
