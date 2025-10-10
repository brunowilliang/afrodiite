import '@/styles/globals.css';
import 'react-photo-view/dist/react-photo-view.css';
import '@/lib/orpc/server';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';

export const dynamic = 'auto';

import { Geist_Mono, Outfit } from 'next/font/google';
import Script from 'next/script';
import { Providers } from '@/providers';

const outfit = Outfit({
	variable: '--font-outfit',
	subsets: ['latin'],
});

const mono = Geist_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
});

type Props = Readonly<{
	children: React.ReactNode;
}>;

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_CORS_ORIGIN || 'http://localhost:3000',
	),
	title: {
		template: '%s | Afrodiite',
		default: 'Afrodiite - Acompanhantes de Luxo em Portugal',
	},
	description:
		'Descubra as melhores acompanhantes de luxo em Portugal. Perfis verificados, avaliações reais e experiências exclusivas em Lisboa, Porto e mais cidades.',
	keywords: [
		'acompanhantes portugal',
		'acompanhantes lisboa',
		'acompanhantes porto',
		'acompanhantes luxo',
		'escort portugal',
		'acompanhantes vip',
	],
	authors: [{ name: 'Afrodiite' }],
	creator: 'Afrodiite',
	publisher: 'Afrodiite',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: 'website',
		locale: 'pt_PT',
		url: process.env.NEXT_PUBLIC_CORS_ORIGIN || 'http://localhost:3000',
		siteName: 'Afrodiite',
		title: 'Afrodiite - Acompanhantes de Luxo em Portugal',
		description:
			'Descubra as melhores acompanhantes de luxo em Portugal. Perfis verificados, avaliações reais e experiências exclusivas.',
		images: [
			{
				url: '/api/og',
				width: 1200,
				height: 630,
				alt: 'Afrodiite - Acompanhantes de Luxo em Portugal',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Afrodiite - Acompanhantes de Luxo em Portugal',
		description:
			'Descubra as melhores acompanhantes de luxo em Portugal. Perfis verificados, avaliações reais e experiências exclusivas.',
		images: ['/api/og'],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	verification: {
		google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
	},
};

export default function RootLayout({ children }: Props) {
	return (
		<html lang="pt-PT" suppressHydrationWarning>
			<head>
				<link
					rel="stylesheet"
					href="https://sets.hugeicons.com/tilwtevunhk.css"
					crossOrigin="anonymous"
				/>
				<Script
					defer
					src="https://cloud.umami.is/script.js"
					data-website-id="1933715a-8066-4081-8944-00d09e273ca9"
				/>
			</head>
			<GoogleTagManager gtmId="GTM-PXW8JX3R" />
			<GoogleAnalytics gaId="G-NQBNKRB15S" />
			<body className={`${outfit.variable} ${mono.variable} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
