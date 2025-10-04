import '@/styles/globals.css';
import 'react-photo-view/dist/react-photo-view.css';
import '@/lib/orpc/server';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

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
