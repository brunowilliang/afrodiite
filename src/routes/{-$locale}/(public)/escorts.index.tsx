import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/{-$locale}/(public)/escorts/')({
	component: Outlet,
	beforeLoad: () => {
		throw redirect({
			to: '/{-$locale}/escorts/$country',
			params: { country: 'portugal' },
			statusCode: 302,
		})
	},
});
