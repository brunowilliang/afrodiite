import { IReviews } from '@/api/utils/schemas/reviews';
import { Stack } from '@/components/core/Stack';
import { getReviews } from '../../components/actions/getReviews';
import { Badge } from '../../components/Badge';
import { Reviews } from '../../components/Reviews';

export default async function Avaliacoes() {
	const reviews = await getReviews();

	return (
		<Stack className="gap-5">
			<Badge icon="Reviews" label="Avaliações" />
			<Reviews reviews={reviews?.results as IReviews.Output[]} />
		</Stack>
	);
}
