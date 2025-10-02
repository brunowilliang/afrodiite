import { Header } from '@/components/Header/Public';

type Props = Readonly<{
	children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
	return (
		<section className="px-4">
			<Header />
			<section className="mx-auto w-full max-w-5xl py-4">{children}</section>
		</section>
	);
}
