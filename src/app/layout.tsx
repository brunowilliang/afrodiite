import type { Metadata } from "next";
import { Anybody, Poppins } from "next/font/google";
import "../styles/global.css";
import { Logo } from "@/components/Logo";
import { Providers } from "@/providers";

const poppins = Poppins({
	variable: "--font-anybody",
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: "Afrodiite",
	description: "Onde o prazer encontra a perfeição",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${poppins.className} font-anybody antialiased`}>
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						<Logo />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
