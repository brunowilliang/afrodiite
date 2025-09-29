'use client';

import { Card } from '@/components/core/Card';
import { MenuTabs } from '@/components/core/Header';

type Props = Readonly<{
	children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
	return (
		<section className="mx-auto grid w-full max-w-5xl grid-cols-12 gap-5 overflow-visible">
			<div className="hidden md:col-span-3 md:block">
				<MenuTabs showAuthMenu />
			</div>

			<Card
				className="col-span-full min-h-[calc(100vh-110px-20px)] overflow-visible bg-default/10 p-4 md:col-span-9"
				shadow="none"
			>
				{children}
			</Card>
		</section>
	);
}
