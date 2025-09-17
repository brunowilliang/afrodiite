import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useRouteContext } from '@tanstack/react-router';
import { useState } from 'react';
import { IReviews } from '@/api/utils/schemas/reviews';
import { Icon } from '@/components/core/Icon';
import { Stack } from '@/components/core/Stack';
import { Badge } from '@/components/heroui/Badge';
import { Button } from '@/components/heroui/Button';
import { Dropdown } from '@/components/heroui/Dropdown';
import { Reviews } from '@/components/heroui/Reviews';
import { Tabs } from '@/components/heroui/Tabs';
import { api } from '@/lib/api';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/reviews')({
	component: RouteComponent,
});

function RouteComponent() {
	const { queryClient } = useRouteContext({ from: '/{-$locale}' });
	const [status, setStatus] = useState<IReviews.Output['status']>('pending');

	const { data: reviews, isLoading: isReviewsLoading } = useQuery(
		api.queries.reviews.list.queryOptions({
			input: { status },
		}),
	);

	const updateReview = useMutation(
		api.queries.reviews.update.mutationOptions({
			onSuccess: () => {
				console.log('🔑 Invalidating Key:', api.queries.reviews.list.key());

				queryClient.invalidateQueries({
					queryKey: api.queries.reviews.list.key(),
				});
			},
			onError: (error) => console.error(error),
		}),
	);

	return (
		<Stack className="gap-5">
			<Badge>
				<Icon name="Stars" variant="bulk" size="20" />
				Avaliações
			</Badge>

			<Tabs
				aria-label="Filter Stats"
				selectedKey={status}
				onSelectionChange={(key) => {
					setStatus(key as IReviews.Output['status']);
				}}
			>
				<Tabs.Tab key="pending" title="Pendentes" />
				<Tabs.Tab key="approved" title="Aprovadas" />
				<Tabs.Tab key="rejected" title="Rejeitadas" />
			</Tabs>

			{reviews?.results.length === 0 && (
				<span className="py-5 text-center text-default-600 text-small">
					Nenhuma avaliação encontrada
				</span>
			)}
			{isReviewsLoading && (
				<span className="py-5 text-center text-default-600 text-small">
					Carregando...
				</span>
			)}
			{reviews?.results.map((review) => (
				<Reviews.Card
					shadow="none"
					key={review.id}
					title={review.title}
					created_at={review.created_at}
					reviewer_name={review.reviewer_name}
					rating={review.rating}
					comment={review.comment}
					endContent={
						<Dropdown placement="bottom-end" backdrop="opaque">
							<Dropdown.Trigger>
								<Button isIconOnly variant="flat" color="default" size="md">
									<Icon name="VerticalDots" />
								</Button>
							</Dropdown.Trigger>
							<Dropdown.Menu
								disabledKeys={
									status === 'approved'
										? ['approved']
										: status === 'rejected'
											? ['rejected']
											: status === 'pending'
												? ['pending']
												: []
								}
							>
								<Dropdown.Item
									key="pending"
									color="warning"
									className="px-3 py-2.5 text-warning data-[disabled=true]:opacity-40"
									endContent={<Icon name="ClockSquare" size="20" />}
									onPress={() =>
										updateReview.mutate({ id: review.id, status: 'pending' })
									}
								>
									Pendente
								</Dropdown.Item>
								<Dropdown.Item
									key="approved"
									className="px-3 py-2.5 text-default-600 data-[disabled=true]:opacity-40"
									endContent={<Icon name="CheckSquare" size="20" />}
									onPress={() =>
										updateReview.mutate({ id: review.id, status: 'approved' })
									}
								>
									Aprovar
								</Dropdown.Item>
								<Dropdown.Item
									key="rejected"
									color="danger"
									className="px-3 py-2.5 text-danger data-[disabled=true]:opacity-40"
									endContent={<Icon name="CancelSquare" size="20" />}
									onPress={() =>
										updateReview.mutate({ id: review.id, status: 'rejected' })
									}
								>
									Rejeitar
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					}
				/>
			))}
		</Stack>
	);
}
