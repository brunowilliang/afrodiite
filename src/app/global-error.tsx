'use client';

import { Geist_Mono, Outfit } from 'next/font/google';
import { Link } from '@/components/core/Link';

const outfit = Outfit({
	variable: '--font-outfit',
	subsets: ['latin'],
});

const mono = Geist_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
});

type Props = Readonly<{
	error: Error & { digest?: string };
	reset: () => void;
}>;

export default function GlobalError({ error }: Props) {
	return (
		<html lang="pt-PT" suppressHydrationWarning>
			<body
				className={`${outfit.variable} ${mono.variable} centered mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-4 antialiased`}
			>
				<h1 className="font-bold text-2xl">Erro</h1>
				<p className="text-md">{error.name}</p>
				<p className="text-md">{error.message}</p>
				<Link href="/">Voltar para a página inicial</Link>
			</body>
		</html>
	);
}
