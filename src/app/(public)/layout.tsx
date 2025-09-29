type Props = Readonly<{
	children: React.ReactNode;
}>;

// export default async function RootLayout({ children }: Props) {
// 	return (
// 		<section className="mx-auto flex min-h-screen max-w-5xl flex-col gap-5 overflow-visible px-4 pb-5">
// 			<Header />
// 			{children}
// 		</section>
// 	);
// }
export default function RootLayout({ children }: Props) {
	return children;
}
