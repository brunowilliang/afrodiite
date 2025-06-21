import type { Metadata } from "next";
import { Anybody } from "next/font/google";
import "../styles/global.css";
import { Logo } from "@/components/Logo";
import { Providers } from "@/providers";

const anybody = Anybody({
	variable: "--font-anybody",
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: "Moorgana",
	description: "Moorgana",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${anybody.className} bg-background font-anybody antialiased`}
			>
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						{/* <Header /> */}
						<Logo />
						{children}
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
