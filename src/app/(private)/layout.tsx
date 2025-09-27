import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Card } from '@/components/core/Card';
import { Header, MenuTabs } from '@/components/core/Header';
import { api } from '@/lib/orpc';

type Props = Readonly<{
	children: React.ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
	// 🔥 SSR - busca dados no servidor
	const profile = (await api.orpc.profile.get()) as IProfile.Select | undefined;

	return (
		<section className="mx-auto flex min-h-screen max-w-5xl flex-col gap-5 overflow-visible px-4 pb-5">
			<Header profile={profile} />
			<section className="mx-auto grid w-full max-w-5xl grid-cols-12 gap-5 overflow-visible">
				<div className="hidden md:col-span-3 md:block">
					<MenuTabs />
				</div>

				<Card
					className="col-span-full min-h-[calc(100vh-110px-20px)] overflow-visible bg-default/10 p-4 md:col-span-9"
					shadow="none"
				>
					{children}
				</Card>
			</section>
		</section>
	);
}
