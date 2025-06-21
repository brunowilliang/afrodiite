import Image from "next/image";
import Link from "next/link";

export function Logo() {
	return (
		<div className="centered fixed z-50 h-20 w-full bg-background/10 backdrop-blur-lg">
			<Link href="/">
				<Image
					src="/assets/logo.svg"
					alt="Moorgana Logo"
					width={100}
					height={100}
					className="z-50 size-40"
					priority
				/>
			</Link>
		</div>
	);
}
