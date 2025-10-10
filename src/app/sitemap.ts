import type { MetadataRoute } from 'next';
import { api } from '@/lib/orpc';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl =
		process.env.NEXT_PUBLIC_CORS_ORIGIN || 'https://afrodiite.com';

	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${baseUrl}/portugal`,
			lastModified: new Date(),
			changeFrequency: 'hourly',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/politica-de-privacidade`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.3,
		},
		{
			url: `${baseUrl}/politica-de-cookies`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.3,
		},
		{
			url: `${baseUrl}/termos-e-condicoes`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.3,
		},
	];

	// Fetch all visible escort profiles
	try {
		const profiles = await api.orpc.escorts.listAll({});

		const escortPages: MetadataRoute.Sitemap = profiles
			.filter((profile) => profile.slug)
			.map((profile) => ({
				url: `${baseUrl}/acompanhante/${profile.public_id}/${profile.slug}`,
				lastModified: profile.updated_at || new Date(),
				changeFrequency: 'weekly',
				priority: 0.8,
			}));

		return [...staticPages, ...escortPages];
	} catch (error) {
		console.error('Error generating sitemap:', error);
		return staticPages;
	}
}
