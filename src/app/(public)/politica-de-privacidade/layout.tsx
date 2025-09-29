import { Metadata } from 'next';
import { Container } from '@/components/core/Stack';

type Props = Readonly<{
	children: React.ReactNode;
}>;

export const metadata: Metadata = {
	title: 'Política de Privacidade',
	description: 'Política de Privacidade',
};

export default function RootLayout({ children }: Props) {
	return <Container className="max-w-2xl gap-10 py-8">{children}</Container>;
}
