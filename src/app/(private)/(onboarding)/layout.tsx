'use client';

import { redirect } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';

type Props = Readonly<{
	children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
	const { profile } = useProfile();

	if (profile?.is_onboarding_complete) {
		return redirect('/painel');
	}

	return (
		<div className="mx-auto w-full max-w-3xl overflow-visible py-4">
			{children}
		</div>
	);
}
