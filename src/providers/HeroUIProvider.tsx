'use client';

import { UrlObject } from 'node:url';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { I18nProvider } from '@react-aria/i18n';
import { useRouter } from 'next/navigation';
import { PhotoProvider } from 'react-photo-view';

export type Href = __next_route_internal_types__.RouteImpl<UrlObject>;

// TypeScript module augmentation for proper HeroUI routing
declare module '@react-types/shared' {
	interface RouterConfig {
		href: Href;
		routerOptions: NonNullable<
			Parameters<ReturnType<typeof useRouter>['push']>[1]
		>;
	}
}

type Props = {
	children: React.ReactNode;
};

export const HeroProvider = ({ children }: Props) => {
	const router = useRouter();

	// Properly typed navigate function for HeroUI compatibility
	const navigate = (
		href: Href,
		routerOptions?: NonNullable<
			Parameters<ReturnType<typeof useRouter>['push']>[1]
		>,
	) => {
		// Convert string href to Next.js RouteImpl type
		router.push(href as Parameters<typeof router.push>[0], {
			...routerOptions,
		});
		router.prefetch(href as Parameters<typeof router.prefetch>[0]);
	};

	return (
		<PhotoProvider>
			<HeroUIProvider navigate={navigate}>
				<I18nProvider locale="pt-PT">
					{children}
					<ToastProvider
						toastOffset={20}
						maxVisibleToasts={2}
						placement="top-center"
					/>
				</I18nProvider>
			</HeroUIProvider>
		</PhotoProvider>
	);
};
