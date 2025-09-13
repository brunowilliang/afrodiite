import { HeroUIProvider } from '@heroui/react';
import { I18nProvider } from '@react-aria/i18n';
import { NavigateOptions, ToOptions, useRouter } from '@tanstack/react-router';

declare module '@react-types/shared' {
	interface RouterConfig {
		href: ToOptions['to'];
		routerOptions: NavigateOptions;
	}
}

type Props = {
	children: React.ReactNode;
};

export const HeroProvider = ({ children }: Props) => {
	const router = useRouter();
	return (
		<HeroUIProvider
			navigate={(to, options) => router.navigate({ to, ...options })}
			useHref={(to) => router.buildLocation({ to }).href}
		>
			<I18nProvider locale="pt-PT">{children}</I18nProvider>
		</HeroUIProvider>
	);
};
