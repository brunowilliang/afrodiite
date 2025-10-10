import { Icon } from '@/components/core/Icon';
import { Link } from '@/components/core/Link';
import { Logo } from '@/components/core/Logo';

type Props = Readonly<{
	children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
	return (
		<div className="centered mx-auto flex min-h-[100dvh] w-full max-w-md flex-col gap-14">
			<Logo />
			{children}
			<Link href="/">
				<Icon name="ArrowLeft" className="mr-1" />
				Voltar para a página inicial
			</Link>
		</div>
	);
}
