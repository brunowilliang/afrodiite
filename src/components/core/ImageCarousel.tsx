'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { useStyled } from 'use-styled';
import { cn } from '@/lib/utils';

const CarouselRoot = useStyled('div', {
	base: { className: 'relative w-full' },
});

const CarouselViewport = useStyled('div', {
	base: { className: 'overflow-hidden rounded-lg' },
});

const CarouselContainer = useStyled('div', {
	base: { className: 'flex' },
});

const CarouselSlide = useStyled('div', {
	base: { className: 'relative aspect-square flex-[0_0_100%] overflow-hidden' },
});

const CarouselImage = useStyled('img', {
	base: { className: 'size-full object-cover' },
});

const DotsContainer = useStyled('div', {
	base: {
		className: '-translate-x-1/2 absolute bottom-3 left-1/2 z-10 flex gap-1.5',
	},
});

const NavigationZone = useStyled('button', {
	base: {
		className: cn(
			'absolute top-0 h-full bg-transparent',
			'before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300',
			'hover:before:opacity-100',
		),
	},
	variants: {
		position: {
			left: {
				className: cn(
					'left-0 w-1/3',
					'before:bg-gradient-to-r before:from-black/50 before:to-transparent',
				),
			},
			right: {
				className: cn(
					'right-0 w-1/3',
					'before:bg-gradient-to-l before:from-black/50 before:to-transparent',
				),
			},
		},
	},
});

const Dot = useStyled('button', {
	base: {
		className: cn(
			'size-3 rounded-full bg-text-primary/70 transition-all duration-300',
		),
	},
	variants: {
		active: {
			true: { className: 'w-8' },
		},
	},
	defaultVariants: {
		active: false,
	},
});

interface ImageCarouselProps {
	images: Array<{
		src: string;
		alt?: string;
	}>;
	aspectRatio?: 'square' | 'video' | 'portrait';
	onSlideChange?: (index: number) => void;
}

export function ImageCarousel({
	images,
	aspectRatio = 'square',
	onSlideChange,
}: ImageCarouselProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: false,
		duration: 20,
		skipSnaps: false,
		dragFree: false,
		watchDrag: false,
		dragThreshold: 0,
	});

	const [selectedIndex, setSelectedIndex] = useState(0);

	const scrollTo = useCallback(
		(index: number) => {
			emblaApi?.scrollTo(index);
		},
		[emblaApi],
	);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		const index = emblaApi.selectedScrollSnap();
		setSelectedIndex(index);
		onSlideChange?.(index);
	}, [emblaApi, onSlideChange]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on('select', onSelect);
		emblaApi.on('reInit', onSelect);
		return () => {
			emblaApi.off('select', onSelect);
			emblaApi.off('reInit', onSelect);
		};
	}, [emblaApi, onSelect]);

	const handleDotClick = (
		e: React.MouseEvent<HTMLButtonElement>,
		index: number,
	) => {
		e.preventDefault();
		e.stopPropagation();
		scrollTo(index);
	};

	const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		emblaApi?.scrollPrev();
	};

	const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		emblaApi?.scrollNext();
	};

	const aspectRatioClasses = {
		square: 'aspect-square',
		video: 'aspect-video',
		portrait: 'aspect-[3/4]',
	};

	return (
		<CarouselRoot className={aspectRatioClasses[aspectRatio]}>
			<CarouselViewport ref={emblaRef}>
				<CarouselContainer>
					{images.map((image, index) => (
						<CarouselSlide key={index}>
							<CarouselImage
								src={image.src}
								alt={image.alt || `Slide ${index + 1}`}
								loading={index === 0 ? 'eager' : 'lazy'}
							/>
						</CarouselSlide>
					))}
				</CarouselContainer>
			</CarouselViewport>

			{images.length > 1 && (
				<>
					<NavigationZone
						type="button"
						position="left"
						onClick={handlePrevious}
						aria-label="Previous image"
					/>
					<NavigationZone
						type="button"
						position="right"
						onClick={handleNext}
						aria-label="Next image"
					/>
					<DotsContainer>
						{images.map((_, index) => (
							<Dot
								key={index}
								type="button"
								active={index === selectedIndex}
								onClick={(e) => handleDotClick(e, index)}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</DotsContainer>
				</>
			)}
		</CarouselRoot>
	);
}
