import { IReviews } from '@/api/utils/schemas/reviews';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/orpc';
import { Badge } from '../components/Badge';
import { ReviewsComponent } from '../components/Reviews';

export default async function Avaliacoes() {
	const reviews = (await api.orpc.reviews.list()) as IReviews.List;

	return (
		<Stack className="gap-5">
			<Badge icon="Reviews" label="Avaliações" />
			<ReviewsComponent reviews={reviews} />
		</Stack>
	);
}
