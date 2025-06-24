import type { Metadata } from "next";
import { Logo } from "@/components/Logo";

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
		<div className="grid h-svh grid-rows-[auto_1fr]">
			<Logo />
			{children}
		</div>
	);
}
