import {
	ThemeProvider as NextThemesProvider,
	type ThemeProviderProps,
} from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute="class"
			forcedTheme="dark"
			storageKey="theme"
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}
