"use client";

interface PatternProps {
	children: React.ReactNode;
}

export function Pattern({ children }: PatternProps) {
	return (
		<div className="relative flex min-h-screen w-full items-center justify-center bg-background">
			{/* PATTERN SVG BACKGROUND */}
			<div
				className="absolute inset-0 bg-[length:400%] bg-center bg-no-repeat opacity-50 md:bg-[length:100%]"
				style={{
					backgroundImage: "url(/assets/pattern.svg)",
				}}
			/>
			<div
				className="absolute inset-0 bg-[length:400%] bg-center bg-no-repeat opacity-50 md:bg-[length:100%]"
				style={{
					backgroundImage: "url(/assets/pattern.svg)",
				}}
			/>
			<div
				className="absolute inset-0 bg-[length:400%] bg-center bg-no-repeat opacity-50 md:bg-[length:200%]"
				style={{
					backgroundImage: "url(/assets/pattern.svg)",
				}}
			/>
			<div
				className="absolute inset-0 bg-[length:400%] bg-center bg-no-repeat opacity-50 md:bg-[length:200%]"
				style={{
					backgroundImage: "url(/assets/pattern.svg)",
				}}
			/>

			{/* NOISE SVG */}
			<svg
				className="pointer-events-none absolute inset-0 h-full w-full"
				style={{ mixBlendMode: "color-burn" }}
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
			>
				<defs>
					<filter id="noise">
						<feTurbulence
							type="fractalNoise"
							baseFrequency="10"
							numOctaves="10"
							result="turbulence"
						/>
						<feComposite
							operator="in"
							in="turbulence"
							in2="SourceAlpha"
							result="composite"
						/>
						<feColorMatrix in="composite" type="luminanceToAlpha" />
						<feBlend in="SourceGraphic" in2="composite" mode="multiply" />
					</filter>
				</defs>
				<rect
					width="100%"
					height="100%"
					fill="rgba(128,128,128,0.5)"
					filter="url(#noise)"
					opacity="1"
				/>
			</svg>

			{/* CHILDREN CONTENT */}
			<div className="relative z-20">{children}</div>
		</div>
	);
}
