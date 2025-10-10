import type { Metadata } from 'next';

type ProfileData = {
	artist_name: string | null;
	name: string;
	city: string | null;
	description: string | null;
	public_id: number | null;
	slug: string | null;
	gallery?: Array<{ url: string }> | null;
};

type ReviewData = {
	id: number | string;
	reviewer_name: string;
	rating: number;
	title: string;
	comment: string;
	created_at: Date;
};

/**
 * Generate metadata for escort profile page
 */
export function generateProfileMetadata(profile: ProfileData): Metadata {
	const displayName = profile.artist_name || profile.name;
	const location = profile.city || 'Portugal';

	const title = `${displayName} - Acompanhante em ${location}`;
	const description =
		profile.description?.slice(0, 160) ||
		`Conheça ${displayName}, acompanhante de luxo em ${location}. Perfil verificado com avaliações reais.`;

	// Generate dynamic OG image URL
	const ogImageUrl = `/api/og?name=${encodeURIComponent(displayName)}&city=${encodeURIComponent(location)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'profile',
			url: `/acompanhante/${profile.public_id}/${profile.slug}`,
			images: [
				{
					url: ogImageUrl,
					width: 1200,
					height: 630,
					alt: displayName,
				},
			],
		},
		twitter: {
			title,
			description,
			card: 'summary_large_image',
			images: [ogImageUrl],
		},
		alternates: {
			canonical: `/acompanhante/${profile.public_id}/${profile.slug}`,
		},
	};
}

/**
 * Generate JSON-LD structured data for escort profile
 */
export function generateProfileJsonLd(
	profile: ProfileData,
	reviews: ReviewData[] = [],
) {
	const displayName = profile.artist_name || profile.name;
	const baseUrl =
		process.env.NEXT_PUBLIC_CORS_ORIGIN || 'https://afrodiite.com';
	const profileUrl = `${baseUrl}/acompanhante/${profile.public_id}/${profile.slug}`;

	// Calculate aggregate rating
	const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
	const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

	const personSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: displayName,
		description: profile.description || undefined,
		address: profile.city
			? {
					'@type': 'PostalAddress',
					addressLocality: profile.city,
					addressCountry: 'PT',
				}
			: undefined,
		image:
			profile.gallery && profile.gallery.length > 0
				? profile.gallery[0].url
				: undefined,
		url: profileUrl,
	};

	// Add aggregate rating if there are reviews
	const aggregateRating =
		reviews.length > 0
			? {
					'@type': 'AggregateRating',
					ratingValue: averageRating.toFixed(1),
					reviewCount: reviews.length,
					bestRating: 5,
					worstRating: 1,
				}
			: undefined;

	// Add individual reviews
	const reviewSchemas = reviews.map((review) => ({
		'@type': 'Review',
		author: {
			'@type': 'Person',
			name: review.reviewer_name,
		},
		datePublished: review.created_at.toISOString(),
		reviewRating: {
			'@type': 'Rating',
			ratingValue: review.rating,
			bestRating: 5,
			worstRating: 1,
		},
		name: review.title,
		reviewBody: review.comment,
	}));

	return {
		...personSchema,
		aggregateRating,
		review: reviewSchemas.length > 0 ? reviewSchemas : undefined,
	};
}

/**
 * Generate metadata for search/listing pages
 */
export function generateListingMetadata(search?: string): Metadata {
	const title = search
		? `Acompanhantes em ${search} | Portugal`
		: 'Acompanhantes de Luxo em Portugal';

	const description = search
		? `Encontre acompanhantes de luxo em ${search}. Perfis verificados, avaliações reais e experiências exclusivas em Portugal.`
		: 'Descubra as melhores acompanhantes de luxo em Portugal. Perfis verificados em Lisboa, Porto, Braga, Coimbra e mais cidades.';

	const ogImageUrl = '/api/og';

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: search
				? `/portugal?search=${encodeURIComponent(search)}`
				: '/portugal',
			images: [
				{
					url: ogImageUrl,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			title,
			description,
			card: 'summary_large_image',
			images: [ogImageUrl],
		},
		alternates: {
			canonical: search
				? `/portugal?search=${encodeURIComponent(search)}`
				: '/portugal',
		},
	};
}

/**
 * Generate JSON-LD for website (homepage)
 */
export function generateWebsiteJsonLd() {
	const baseUrl =
		process.env.NEXT_PUBLIC_CORS_ORIGIN || 'https://afrodiite.com';

	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Afrodiite',
		description:
			'Descubra as melhores acompanhantes de luxo em Portugal. Perfis verificados, avaliações reais e experiências exclusivas em Lisboa, Porto e mais cidades.',
		url: baseUrl,
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${baseUrl}/portugal?search={search_term_string}`,
			},
			'query-input': 'required name=search_term_string',
		},
	};
}
