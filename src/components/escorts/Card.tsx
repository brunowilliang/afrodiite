import { Link } from '@tanstack/react-router';
import { Card } from '@/components/core/Card';
import { DATA_IMAGES, ImageCarousel } from '@/components/core/ImageCarousel';
import { Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { cn } from '@/lib/utils';

export function EscortCard() {
	return (
		<Link
			to="/{-$locale}/escorts/$slug"
			params={{ slug: 'alycia-bittencourt' }}
			viewTransition
		>
			<Card clickable className="gap-1 p-1">
				<ImageCarousel images={DATA_IMAGES} />
				<Stack className="w-full items-start gap-2 p-2">
					<Stack
						direction="row"
						className="w-full flex-wrap items-center justify-between gap-1"
					>
						<Card.Badge className="gap-0 p-1 px-2">
							<Card.Badge.Text className="text-sm md:text-base">
								€120/1 hora
							</Card.Badge.Text>
						</Card.Badge>
						<Card.Badge
							className={cn(
								'gap-0 border-transparent bg-transparent p-0 text-primary',
								'md:border md:border-primary-20 md:bg-primary-10 md:px-2 md:py-1 md:text-primary',
							)}
						>
							<Card.Badge.Text className="text-sm md:text-base">
								4.7/
							</Card.Badge.Text>
							<Card.Badge.Icon name="Star" variant="solid" size="14" />
						</Card.Badge>
					</Stack>
					<Stack className="items-start">
						<Text as={'h4'} weight="normal" className="text-md md:text-xl">
							Alycia Bittencourt
						</Text>
						<Text as="p" color="textSecondary" className="text-sm md:text-base">
							Lisboa, Portugal
						</Text>
					</Stack>
				</Stack>
			</Card>
		</Link>
	);
}
