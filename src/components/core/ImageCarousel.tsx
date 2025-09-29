import { Image } from '@heroui/react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { PhotoSlider } from 'react-photo-view';
import { useStyled } from 'use-styled';
import { GalleryItem } from '@/api/utils/schemas/escort-core';
import { cn } from '@/utils/cn';

export const DATA_IMAGES = [
	{ src: '/assets/profile-2.png', alt: 'Alycia Bittencourt - Photo 1' },
	{ src: '/assets/profile-3.png', alt: 'Alycia Bittencourt - Photo 2' },
	{ src: '/assets/profile.png', alt: 'Alycia Bittencourt - Photo 3' },
];

// Width mapping for Tailwind classes
const CAROUSEL_WIDTH_CLASSES = {
	'100%': 'flex-[0_0_100%]',
	'95%': 'flex-[0_0_95%]',
	'90%': 'flex-[0_0_90%]',
	'85%': 'flex-[0_0_85%]',
	'80%': 'flex-[0_0_80%]',
	'75%': 'flex-[0_0_75%]',
	'70%': 'flex-[0_0_70%]',
	'65%': 'flex-[0_0_65%]',
	'60%': 'flex-[0_0_60%]',
	'55%': 'flex-[0_0_55%]',
	'50%': 'flex-[0_0_50%]',
	'45%': 'flex-[0_0_45%]',
	'40%': 'flex-[0_0_40%]',
	'35%': 'flex-[0_0_35%]',
	'30%': 'flex-[0_0_30%]',
	'25%': 'flex-[0_0_25%]',
	'20%': 'flex-[0_0_20%]',
	'15%': 'flex-[0_0_15%]',
	'10%': 'flex-[0_0_10%]',
	'5%': 'flex-[0_0_5%]',
} as const;

type CarouselWidth = keyof typeof CAROUSEL_WIDTH_CLASSES;

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
	base: { className: 'relative aspect-[3/4] overflow-hidden' },
});

const CarouselImage = useStyled(Image, {
	base: {
		className: 'aspect-[3/4] cursor-zoom-in object-cover',
		isBlurred: true,
	},
});

const DotsContainer = useStyled('div', {
	base: {
		className: '-translate-x-1/2 absolute bottom-2 left-1/2 z-10 flex gap-1.5',
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
					'left-0 w-1/6',
					'before:bg-gradient-to-r before:from-black/50 before:to-transparent',
				),
			},
			right: {
				className: cn(
					'right-0 w-1/6',
					'before:bg-gradient-to-l before:from-black/50 before:to-transparent',
				),
			},
		},
	},
});

const Dot = useStyled('button', {
	base: {
		className: cn(
			'rounded-full bg-text-primary/80 transition-all duration-300',
		),
	},
	variants: {
		active: {
			true: { className: 'w-[1.8rem]' },
		},
		size: {
			small: { className: 'h-2 w-2' },
			medium: { className: 'h-3 w-3' },
			large: { className: 'h-4 w-4' },
		},
	},
});

interface ImageCarouselProps {
	images: GalleryItem[];
	width?: CarouselWidth;
	gap?: string;
	children?: React.ReactNode;
	openPreview?: boolean;
	drag?: boolean;
	dotSize?: 'small' | 'medium' | 'large';
	onSlideChange?: (index: number) => void;
}

export function ImageCarousel({
	images,
	children,
	onSlideChange,
	width = '100%',
	gap = '0',
	drag = false,
	openPreview = false,
	dotSize = 'small',
}: ImageCarouselProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: false,
		duration: 20,
		skipSnaps: true,
		dragFree: false,
		watchDrag: drag,
	});

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [visible, setVisible] = useState(false);
	const [photoIndex, setPhotoIndex] = useState(0);

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

	return (
		<>
			<CarouselRoot>
				<CarouselViewport ref={emblaRef}>
					<CarouselContainer className={cn(`gap-${gap}`)}>
						{images.map((image, index) => (
							<CarouselSlide
								key={index}
								className={CAROUSEL_WIDTH_CLASSES[width]}
							>
								<CarouselImage
									src={image.url}
									alt={image.id || `Slide ${index + 1}`}
									loading={index === 0 ? 'eager' : 'lazy'}
									onClick={
										openPreview
											? () => {
													setPhotoIndex(index);
													setVisible(true);
												}
											: undefined
									}
									aria-label={`View ${image.id || `Image ${index + 1}`}`}
								/>
							</CarouselSlide>
						))}
						{children}
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
									size={dotSize}
									active={index === selectedIndex}
									onClick={(e) => handleDotClick(e, index)}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</DotsContainer>
					</>
				)}
			</CarouselRoot>

			<PhotoSlider
				images={images.map((img) => ({ src: img.url, key: img.id }))}
				visible={visible}
				onClose={() => setVisible(false)}
				index={photoIndex}
				onIndexChange={setPhotoIndex}
				maskOpacity={0.9}
			/>
		</>
	);
}
