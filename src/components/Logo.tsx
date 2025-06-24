import Image from "next/image";
import Link from "next/link";

export function Logo() {
	return (
		<div className="centered fixed z-50 h-20 py-10 w-full bg-background/10 backdrop-blur-lg">
			<Link href="/">
				<Image
					src="/assets/logo.svg"
					alt="Moorgana Logo"
					width={225.28}
					height={40}
					priority
					className="z-50"
				/>
			</Link>
		</div>
	);
}
