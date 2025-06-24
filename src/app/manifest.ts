import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "afrodiite",
		short_name: "afrodiite",
		description: "Onde o prazer encontra a perfeição",
		start_url: "/",
		display: "standalone",
		background_color: "#EFD9F5",
		theme_color: "#EFD9F5",
		icons: [
			{
				src: "/favicon/web-app-manifest-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/favicon/web-app-manifest-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
