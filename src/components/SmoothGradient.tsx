// SmoothGradient.tsx
"use client";
import { useEffect, useRef } from "react";

export function SmoothGradient() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Criar gradiente radial ultra-suave
		const gradient = ctx.createRadialGradient(
			canvas.width / 2,
			canvas.height / 2,
			0,
			canvas.width / 2,
			canvas.height / 2,
			Math.min(canvas.width, canvas.height) / 2,
		);

		// Muitos pontos para suavidade máxima
		for (let i = 0; i <= 100; i++) {
			const opacity = (1 - i / 100) ** 2 * 0.1; // Curva suave
			gradient.addColorStop(
				i / 100,
				`oklch(0.8008 0.1391 318.71 / ${opacity})`,
			);
		}

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 h-full w-full blur-3xl"
			width={800}
			height={800}
		/>
	);
}
