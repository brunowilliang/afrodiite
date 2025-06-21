"use client";

import { Toaster } from "../components/ui/sonner";
import { ThemeProvider } from "./ThemeProvider";

type Props = {
	children: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			{children}
			<Toaster richColors />
		</ThemeProvider>
	);
};
