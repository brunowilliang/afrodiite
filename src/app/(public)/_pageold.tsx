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
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.8008_0.1391_318.71_/_0.2)_0%,oklch(0.8008_0.1391_318.71_/_0.198)_2%,oklch(0.8008_0.1391_318.71_/_0.196)_4%,oklch(0.8008_0.1391_318.71_/_0.194)_6%,oklch(0.8008_0.1391_318.71_/_0.192)_8%,oklch(0.8008_0.1391_318.71_/_0.19)_10%,oklch(0.8008_0.1391_318.71_/_0.188)_12%,oklch(0.8008_0.1391_318.71_/_0.186)_14%,oklch(0.8008_0.1391_318.71_/_0.184)_16%,oklch(0.8008_0.1391_318.71_/_0.182)_18%,oklch(0.8008_0.1391_318.71_/_0.18)_20%,oklch(0.8008_0.1391_318.71_/_0.178)_22%,oklch(0.8008_0.1391_318.71_/_0.176)_24%,oklch(0.8008_0.1391_318.71_/_0.174)_26%,oklch(0.8008_0.1391_318.71_/_0.172)_28%,oklch(0.8008_0.1391_318.71_/_0.17)_30%,oklch(0.8008_0.1391_318.71_/_0.168)_32%,oklch(0.8008_0.1391_318.71_/_0.166)_34%,oklch(0.8008_0.1391_318.71_/_0.164)_36%,oklch(0.8008_0.1391_318.71_/_0.162)_38%,oklch(0.8008_0.1391_318.71_/_0.16)_40%,oklch(0.8008_0.1391_318.71_/_0.155)_42%,oklch(0.8008_0.1391_318.71_/_0.15)_44%,oklch(0.8008_0.1391_318.71_/_0.145)_46%,oklch(0.8008_0.1391_318.71_/_0.14)_48%,oklch(0.8008_0.1391_318.71_/_0.135)_50%,oklch(0.8008_0.1391_318.71_/_0.13)_52%,oklch(0.8008_0.1391_318.71_/_0.125)_54%,oklch(0.8008_0.1391_318.71_/_0.12)_56%,oklch(0.8008_0.1391_318.71_/_0.115)_58%,oklch(0.8008_0.1391_318.71_/_0.11)_60%,oklch(0.8008_0.1391_318.71_/_0.105)_62%,oklch(0.8008_0.1391_318.71_/_0.1)_64%,oklch(0.8008_0.1391_318.71_/_0.095)_66%,oklch(0.8008_0.1391_318.71_/_0.09)_68%,oklch(0.8008_0.1391_318.71_/_0.085)_70%,oklch(0.8008_0.1391_318.71_/_0.08)_72%,oklch(0.8008_0.1391_318.71_/_0.075)_74%,oklch(0.8008_0.1391_318.71_/_0.07)_76%,oklch(0.8008_0.1391_318.71_/_0.065)_78%,oklch(0.8008_0.1391_318.71_/_0.06)_80%,oklch(0.8008_0.1391_318.71_/_0.055)_82%,oklch(0.8008_0.1391_318.71_/_0.05)_84%,oklch(0.8008_0.1391_318.71_/_0.045)_86%,oklch(0.8008_0.1391_318.71_/_0.04)_88%,oklch(0.8008_0.1391_318.71_/_0.035)_90%,oklch(0.8008_0.1391_318.71_/_0.03)_92%,oklch(0.8008_0.1391_318.71_/_0.025)_94%,oklch(0.8008_0.1391_318.71_/_0.02)_96%,oklch(0.8008_0.1391_318.71_/_0.015)_98%,oklch(0.8008_0.1391_318.71_/_0.01)_99%,transparent_100%)] blur-3xl" />
			</div>
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_100%_50%_at_center,transparent_0%,black_70%,black)]" />
			<p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 font-bold text-4xl text-transparent sm:text-7xl">
				Backgrounds
			</p>
		</div>
	);
}
