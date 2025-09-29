'use client';

import { Reviews } from '@/components/core/Reviews';

interface ReviewsWrapperProps {
	escort_id: string;
}

export const ReviewsWrapper = ({ escort_id }: ReviewsWrapperProps) => {
	return (
		<Reviews>
			<Reviews.Header escort_id={escort_id} />
			<Reviews.Card
				reviewer_name="John Doe"
				created_at={new Date()}
				rating={4}
				title="Review title"
				comment="Review content"
			/>
		</Reviews>
	);
};
