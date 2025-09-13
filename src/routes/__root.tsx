/// <reference types="vite/client" />

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { I18nProvider } from '@react-aria/i18n';
import type { QueryClient } from '@tanstack/react-query';
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { PhotoProvider } from 'react-photo-view';
import reactPhotoViewCss from 'react-photo-view/dist/react-photo-view.css?url';
import { api } from '@/lib/api';
import { ThemeProvider } from '@/providers/ThemeProvider';
import appCss from '@/styles/app.css?url';
import { seo } from '@/utils/seo';
import { tryCatch } from '@/utils/tryCatch';

type RootContext = {
	queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RootContext>()({
	component: RootDocument,
	beforeLoad: async () => {
		const [error, session] = await tryCatch(api.client.session());

		if (error) {
			console.warn('Session check failed:', error.message);
			return { session: null };
		}

		return { session };
	},
	head: () => ({
		meta: [
			{
				lang: 'pt-PT',
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			...seo({
				title: 'Afrodiite - O maior site de acompanhantes de Portugal',
				description: 'O maior site de acompanhantes de Portugal',
			}),
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
				href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@200..500&display=swap',
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
});

function RootDocument() {
	return (
		<html lang="pt-PT" className="bg-background" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
					storageKey="afrodite-theme"
				>
					<PhotoProvider>
						<HeroUIProvider>
							<I18nProvider locale="pt-PT">
								<Outlet />
								<ToastProvider
									toastOffset={20}
									maxVisibleToasts={2}
									placement="top-center"
								/>
							</I18nProvider>
						</HeroUIProvider>
					</PhotoProvider>
				</ThemeProvider>
				<TanStackRouterDevtools position="bottom-right" />
				<Scripts />
			</body>
		</html>
	);
}
