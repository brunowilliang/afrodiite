import { Link } from '@/components/core/Link';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Geist_Mono, Outfit } from 'next/font/google';

const outfit = Outfit({
	variable: '--font-outfit',
	subsets: ['latin'],
});

const mono = Geist_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: '404 - Página não encontrada',
	description: 'A página que você está procurando não existe.',
};

export default function GlobalNotFound() {
	return (
		<html lang="pt-PT" suppressHydrationWarning>
			<body
				className={`${outfit.variable} ${mono.variable} centered mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-4 antialiased`}
			>
				<h1 className="font-bold text-2xl">404 - Page Not Found</h1>
				<p className="text-md">This page does not exist.</p>
				<Link href="/">Voltar para a página inicial</Link>
			</body>
		</html>
	);
}
