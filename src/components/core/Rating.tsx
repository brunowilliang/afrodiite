import { useState } from 'react';
import { Icon } from '@/components/core/Icon';
import { cn } from '@/utils/cn';

interface RatingProps {
	value?: number;
	onChange?: (rating: number) => void;
	readonly?: boolean;
	description?: string;
	isInvalid?: boolean;
	errorMessage?: string;
	size?: 'sm' | 'md' | 'lg';
}

export const Rating = ({
	value = 0,
	onChange,
	readonly = false,
	size = 'md',
	description,
	isInvalid,
	errorMessage,
}: RatingProps) => {
	const [hoveredRating, setHoveredRating] = useState<number | null>(null);
	const stars = Array.from({ length: 5 }, (_, index) => index + 1);

	const handleStarClick = (rating: number) => {
		if (!readonly && onChange) {
			onChange(rating);
		}
	};

	const handleStarHover = (rating: number) => {
		if (!readonly) {
			setHoveredRating(rating);
		}
	};

	const handleMouseLeave = () => {
		if (!readonly) {
			setHoveredRating(null);
		}
	};

	const getSizeClasses = () => {
		switch (size) {
			case 'sm':
				return 'text-sm';
			case 'lg':
				return 'text-2xl';
			default:
				return 'text-lg sm:text-xl';
		}
	};

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
				{stars.map((star) => {
					const isHovered = hoveredRating !== null && star <= hoveredRating;
					const isSelected = star <= value;
					const shouldHighlight = isHovered || (!hoveredRating && isSelected);

					const variant = !hoveredRating && isSelected ? 'solid' : 'stroke';

					return (
						<Icon
							key={star}
							className={cn(
								'transition-colors duration-150',
								getSizeClasses(),
								shouldHighlight ? 'text-default-600' : 'text-default-400',
								!readonly && 'cursor-pointer hover:scale-105',
								isInvalid && 'text-danger',
								isSelected && 'text-primary',
							)}
							name="Star"
							variant={variant}
							onMouseEnter={() => handleStarHover(star)}
							onClick={() => handleStarClick(star)}
						/>
					);
				})}
			</div>
			{description && (
				<span className="text-foreground/50 text-tiny">{description}</span>
			)}
			{isInvalid && errorMessage && (
				<span className="text-danger text-tiny">{errorMessage}</span>
			)}
		</div>
	);
};
