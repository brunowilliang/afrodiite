/// <reference types="vite/client" />
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type * as React from 'react';
import { PhotoProvider } from 'react-photo-view';
import reactPhotoViewCss from 'react-photo-view/dist/react-photo-view.css?url';
import appCss from '@/styles/app.css?url';
import { seo } from '@/utils/seo';

export const Route = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{
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
	shellComponent: RootDocument,
});

type Props = {
	children: React.ReactNode;
};

function RootDocument({ children }: Props) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<PhotoProvider>
					{children}
					<TanStackRouterDevtools position="bottom-right" />
					<Scripts />
				</PhotoProvider>
			</body>
		</html>
	);
}
