'use client';

import { redirect } from 'next/navigation';
import { Card } from '@/components/core/Card';
import { Header } from '@/components/Header/Admin';
import { MenuTabs } from '@/components/Header/Admin/Menu';
import { useProfile } from '@/hooks/useProfile';

type Props = Readonly<{
	children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
	const { profile } = useProfile();

	if (!profile?.is_onboarding_complete) {
		return redirect('/onboarding');
	}

	return (
		<section className="px-4">
			<Header />
			<div className="mx-auto grid w-full max-w-5xl grid-cols-12 gap-5 overflow-visible py-4">
				<div className="hidden md:col-span-3 md:block">
					<MenuTabs />
				</div>

				<Card
					className="col-span-full min-h-[calc(100vh-100px-20px)] overflow-visible bg-default-50 p-4 md:col-span-9"
					shadow="none"
				>
					{children}
				</Card>
			</div>
		</section>
	);
}
