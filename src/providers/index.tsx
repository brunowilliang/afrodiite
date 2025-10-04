import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { HeroProvider } from './HeroUIProvider';
import QueryClientProvider from './QueryClientProvider';
import { ThemeProvider } from './ThemeProvider';

type Props = {
	children: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
	return (
		<NuqsAdapter>
			<ThemeProvider>
				<HeroProvider>
					<QueryClientProvider>{children}</QueryClientProvider>
				</HeroProvider>
			</ThemeProvider>
		</NuqsAdapter>
	);
};
