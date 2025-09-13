import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { Reviews } from '@/components/heroui/Reviews';
import { api } from '@/lib/api';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/reviews')({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: reviews } = useQuery(api.queries.reviews.list.queryOptions());

	return (
		<Container>
			<Text size="2xl" weight="bold">
				Dashboard - Avaliações
			</Text>

			{reviews?.results.map((review) => (
				<Reviews.Card
					key={review.id}
					title={review.title}
					created_at={review.created_at}
					reviewer_name={review.reviewer_name}
					rating={review.rating}
					comment={review.comment}
				/>
			))}
		</Container>
	);
}
