'use client';

import { useMemo, useState } from 'react';
import { IReviews } from '@/api/utils/schemas/reviews';
import { Button } from '@/components/core/Button';
import { Dropdown } from '@/components/core/Dropdown';
import { Icon } from '@/components/core/Icon';
import { Reviews as ReviewsComponent } from '@/components/core/Reviews';
import { Stack } from '@/components/core/Stack';
import { Tabs } from '@/components/core/Tabs';
import { useReviews } from '@/hooks/useReviews';
import { Badge } from '../../components/Badge';

export const Avaliacoes = () => {
	const { reviews, updateReview } = useReviews();

	const [status, setStatus] = useState<IReviews.Output['status']>('pending');

	const filteredReviews = useMemo(() => {
		if (!reviews) return [];
		return reviews.results.filter((review) => review.status === status);
	}, [reviews, status]);

	return (
		<Stack className="gap-5">
			<Badge icon="Reviews" label="Avaliações" />

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

			{filteredReviews.length === 0 && (
				<span className="py-5 text-center text-default-600 text-small">
					Nenhuma avaliação encontrada
				</span>
			)}

			{filteredReviews.map((review) => (
				<ReviewsComponent.Card
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
										updateReview({ id: review.id, status: 'pending' })
									}
								>
									Pendente
								</Dropdown.Item>
								<Dropdown.Item
									key="approved"
									className="px-3 py-2.5 text-default-600 data-[disabled=true]:opacity-40"
									endContent={<Icon name="CheckSquare" size="20" />}
									onPress={() =>
										updateReview({ id: review.id, status: 'approved' })
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
										updateReview({ id: review.id, status: 'rejected' })
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
};
