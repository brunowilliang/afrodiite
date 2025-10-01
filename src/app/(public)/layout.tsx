type Props = Readonly<{
	children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
	return (
		<section className="mx-auto w-full max-w-5xl py-4">{children}</section>
	);
}
