import { Card } from '@/components/core/Card';
import { Icon } from '@/components/core/Icon';
import { Stack } from '@/components/core/Stack';

type Props = {
	number: number;
	small?: boolean;
};

export const Rating = ({ number, small = false }: Props) => {
	const stars = Array.from({ length: 5 }, (_, index) => index);
	const filledStars = Math.floor(number);

	return (
		<Stack direction="row" className="centered gap-2">
			<Card.Badge>
				<Card.Badge.Text>{number}</Card.Badge.Text>
			</Card.Badge>
			{small ? (
				<Icon name="Star" variant="solid" size="24" color="primary" />
			) : (
				<Stack direction="row" className="gap-1">
					{stars.map((star) => (
						<Icon
							key={star}
							name="Star"
							variant={star < filledStars ? 'solid' : 'stroke'}
							size="24"
							color="primary"
						/>
					))}
				</Stack>
			)}
		</Stack>
	);
};
