import { Link } from '@tanstack/react-router';
import { Card } from '@/components/core/Card';
import { ImageCarousel } from '@/components/core/ImageCarousel';
import { Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';

export function EscortCard() {
	const images = [
		{ src: '/assets/profile-2.png', alt: 'Alycia Bittencourt - Photo 1' },
		{ src: '/assets/profile-3.png', alt: 'Alycia Bittencourt - Photo 2' },
		{ src: '/assets/profile.png', alt: 'Alycia Bittencourt - Photo 3' },
	];

	return (
		<Link
			to="/escorts/$slug"
			params={{ slug: 'alycia-bittencourt' }}
			viewTransition
		>
			<Card clickable className="gap-1 p-1">
				<ImageCarousel images={images} aspectRatio="square" />
				<Stack className="w-full items-start gap-3 p-3">
					<Stack
						direction="row"
						className="w-full items-center justify-between"
					>
						<Card.Badge>
							<Card.Badge.Text>€120/1 hora</Card.Badge.Text>
						</Card.Badge>
						<Card.Badge className="gap-0">
							<Card.Badge.Text>4.7/</Card.Badge.Text>
							<Card.Badge.Icon name="Star" variant="solid" size="16" />
						</Card.Badge>
					</Stack>
					<Stack className="items-start">
						<Text as="h4" weight="normal">
							Alycia Bittencourt
						</Text>
						<Text as="p" color="textSecondary">
							Lisboa, Portugal
						</Text>
					</Stack>
				</Stack>
			</Card>
		</Link>
	);
}
