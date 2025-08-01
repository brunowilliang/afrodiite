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
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary';
import { NotFound } from '@/components/NotFound';
import appCss from '@/styles/app.css?url';
import { seo } from '@/utils/seo';

export const Route = createRootRouteWithContext<{
	breadcrumb?: string;
}>()({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			// {
			// 	name: 'theme-color',
			// 	content: '#121214',
			// },
			// {
			// 	name: 'apple-mobile-web-app-status-bar-style',
			// 	content: 'black-translucent',
			// },
			// {
			// 	name: 'apple-mobile-web-app-capable',
			// 	content: 'yes',
			// },
			...seo({
				title:
					'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
				description:
					'TanStack Start is a type-safe, client-first, full-stack React framework.',
			}),
		],
		links: [
			{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
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
			{ rel: 'manifest', href: '/site.webmanifest', color: '#121214' },
		],
	}),
	errorComponent: DefaultCatchBoundary,
	notFoundComponent: () => <NotFound />,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full" style={{ backgroundColor: '#0f0713' }}>
			<head>
				<HeadContent />
				<style
					dangerouslySetInnerHTML={{
						__html: `
						/* Critical CSS - Carrega ANTES de qualquer coisa */
						html { background-color: #0f0713 !important; }
						body { background-color: #0f0713 !important; }
						input, textarea, select {
							background-color: #1a1a1d !important;
							color: #f5f5f5 !important;
							-webkit-appearance: none !important;
							-moz-appearance: none !important;
							appearance: none !important;
						}
						input::placeholder {
							color: #9ca3af !important;
						}
						/* Previne flash no autofill */
						input:-webkit-autofill,
						input:-webkit-autofill:hover,
						input:-webkit-autofill:focus {
							-webkit-text-fill-color: #f5f5f5 !important;
							-webkit-box-shadow: 0 0 0 1000px #1a1a1d inset !important;
							box-shadow: 0 0 0 1000px #1a1a1d inset !important;
							transition: background-color 5000s ease-in-out 0s !important;
						}
					`,
					}}
				/>
			</head>
			<body style={{ backgroundColor: '#0f0713' }}>
				<PhotoProvider>
					{children}
					<TanStackRouterDevtools position="bottom-right" />
					<Scripts />
				</PhotoProvider>
			</body>
		</html>
	);
}
