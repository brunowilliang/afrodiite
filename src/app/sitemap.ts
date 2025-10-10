import { and, eq } from 'drizzle-orm';
import type { MetadataRoute } from 'next';
import { db } from '@/api/database';
import { escortProfiles } from '@/api/database/schemas';

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

	// Fetch all visible escort profiles directly from database
	try {
		const profiles = await db
			.select({
				public_id: escortProfiles.public_id,
				slug: escortProfiles.slug,
				updated_at: escortProfiles.updated_at,
			})
			.from(escortProfiles)
			.where(
				and(
					eq(escortProfiles.is_visible, true),
					eq(escortProfiles.is_onboarding_complete, true),
				),
			);

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
