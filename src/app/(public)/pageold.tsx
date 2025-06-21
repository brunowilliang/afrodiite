import { cn } from "@/lib/utils";

export default function Home() {
	return (
		<div className="relative flex h-full w-full items-center justify-center bg-background">
			<div
				className={cn(
					"absolute inset-0",
					"[background-size:90px_90px]",
					"[background-image:linear-gradient(to_right,oklch(0.8008_0.1391_318.71_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.8008_0.1391_318.71_/_0.1)_1px,transparent_1px)]",
				)}
			/>
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.8008_0.1391_318.71_/_0.2)_0%,oklch(0.8008_0.1391_318.71_/_0.19)_10%,oklch(0.8008_0.1391_318.71_/_0.18)_15%,oklch(0.8008_0.1391_318.71_/_0.17)_20%,oklch(0.8008_0.1391_318.71_/_0.16)_25%,oklch(0.8008_0.1391_318.71_/_0.15)_30%,oklch(0.8008_0.1391_318.71_/_0.13)_35%,oklch(0.8008_0.1391_318.71_/_0.11)_40%,oklch(0.8008_0.1391_318.71_/_0.09)_45%,oklch(0.8008_0.1391_318.71_/_0.07)_50%,oklch(0.8008_0.1391_318.71_/_0.05)_55%,oklch(0.8008_0.1391_318.71_/_0.04)_60%,oklch(0.8008_0.1391_318.71_/_0.03)_65%,oklch(0.8008_0.1391_318.71_/_0.02)_70%,oklch(0.8008_0.1391_318.71_/_0.01)_75%,transparent_80%)] blur-3xl" />
			</div>
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_100%_50%_at_center,transparent_0%,black_70%,black)]" />
			<p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 font-bold text-4xl text-transparent sm:text-7xl">
				Backgrounds
			</p>
		</div>
	);
}
