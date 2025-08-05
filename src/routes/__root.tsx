/// <reference types="vite/client" />

import type { QueryClient } from '@tanstack/react-query';
import {
	createRootRouteWithContext,
	HeadContent,
} from '@tanstack/react-router';
import reactPhotoViewCss from 'react-photo-view/dist/react-photo-view.css?url';
import { api } from '@/api/routes';
import appCss from '@/styles/app.css?url';

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	component: RootDocument,
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'Afrodite - Professional Marketing Platform',
				description:
					'Digital platform for independent professionals in entertainment and events. Boost your visibility and connect with clients.',
			},
		],
		links: [
			{
				rel: 'preconnect',
				href: 'https://fonts.googleapis.com',
				crossOrigin: 'anonymous',
			},
			{
				rel: 'preconnect',
				href: 'https://fonts.gstatic.com',
				crossOrigin: 'anonymous',
			},
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500&display=swap',
			},
			{ rel: 'stylesheet', href: appCss },
			{ rel: 'stylesheet', href: reactPhotoViewCss },
			{
				rel: 'stylesheet',
				href: 'https://sets.hugeicons.com/tilwtevunhk.css',
				crossOrigin: 'anonymous',
			},
			{
				rel: 'apple-touch-icon',
				sizes: '180x180',
				href: '/apple-touch-icon.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				href: '/favicon-32x32.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				href: '/favicon-16x16.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				href: '/favicon.png',
			},
			{
				rel: 'manifest',
				href: '/site.webmanifest',
				color: '#121214',
			},
		],
	}),
	beforeLoad: async ({ context }) => {
		const { queryClient } = context ?? {};
		const { session } = await api.session.get();

		if (!session) {
			return { session: null };
		}

		// const profile = await queryClient.fetchQuery(
		// 	api.profile.get({ id: session.user.id }),
		// )

		// if (!profile) {
		// 	return { session: null, profile: null };
		// }

		return { session };
	},
});

function RootDocument() {
	return (
		<html lang="en" className="h-full">
			<head>
				<HeadContent />
			</head>
			<body
				className="m-0 h-full p-0 font-sans"
				style={{
					fontFamily: 'var(--font-sans)',
					backgroundColor: 'var(--color-background)',
					color: 'var(--color-text-primary)',
				}}
			>
				<div
					className="flex min-h-screen items-center justify-center p-5"
					style={{
						background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-20) 100%)`,
					}}
				>
					<div
						className="w-full max-w-2xl transform rounded-3xl px-10 py-16 text-center shadow-2xl transition-transform duration-300 hover:scale-105"
						style={{
							backgroundColor: 'var(--color-accent)',
							boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
						}}
					>
						<h1
							className="mb-5 font-semibold text-4xl leading-tight md:text-5xl"
							style={{
								color: 'var(--color-text-primary)',
							}}
						>
							Afrodite
						</h1>
						<p
							className="mb-8 text-xl leading-relaxed"
							style={{
								color: 'var(--color-text-secondary)',
							}}
						>
							Digital marketing platform for independent professionals in
							entertainment and events
						</p>
						<div
							className="mb-8 rounded-2xl p-8"
							style={{
								backgroundColor: 'var(--color-accent-10)',
							}}
						>
							<h2
								className="mb-4 font-medium text-2xl"
								style={{
									color: 'var(--color-text-primary)',
								}}
							>
								🚀 Coming Soon
							</h2>
							<p
								className="mb-0"
								style={{
									color: 'var(--color-text-secondary)',
								}}
							>
								New platform to boost your professional visibility and connect
								you with your clients
							</p>
						</div>
						<button
							className="hover:-translate-y-1 transform rounded-full px-10 py-4 font-medium text-lg text-white shadow-lg transition-all duration-200 hover:shadow-xl"
							style={{
								background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-20) 100%)`,
								color: 'var(--color-text-primary)',
							}}
						>
							Get Notified
						</button>
						<div
							className="mt-10 pt-8"
							style={{
								borderTop: '1px solid var(--color-accent-10)',
							}}
						>
							<p
								className="m-0 text-sm"
								style={{
									color: 'var(--color-text-secondary)',
								}}
							>
								Follow us on social media
							</p>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
