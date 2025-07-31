'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { type ComponentProps, useState } from 'react';
import { PhotoSlider } from 'react-photo-view';

type PhotoSliderProps = ComponentProps<typeof PhotoSlider>;

interface ImageCarouselProps {
	images?: Array<{
		src: string;
		alt?: string;
		thumb?: string;
	}>;
	photoViewConfig?: Partial<PhotoSliderProps>;
}

const defaultImages = [
	{ src: '/assets/profile.png', alt: 'Alycia Bittencourt' },
	{ src: '/assets/profile.png', alt: 'Alycia Bittencourt' },
	{ src: '/assets/profile.png', alt: 'Alycia Bittencourt' },
	{ src: '/assets/profile.png', alt: 'Alycia Bittencourt' },
	{ src: '/assets/profile.png', alt: 'Alycia Bittencourt' },
];

export const ImageCarousel = ({
	images = defaultImages,
	photoViewConfig = {},
}: ImageCarouselProps) => {
	const [visible, setVisible] = useState(false);
	const [photoIndex, setPhotoIndex] = useState(0);

	const [emblaRef] = useEmblaCarousel(
		{
			align: 'center',
			loop: false,
			duration: 20,
			axis: 'x',
			skipSnaps: true,
		},
		[WheelGesturesPlugin()],
	);

	return (
		<>
			<div className="w-full flex-shrink-0 overflow-hidden rounded-lg">
				<div ref={emblaRef}>
					<div className="flex h-full select-none gap-1">
						{images.map((image, index) => (
							<button
								type="button"
								key={index}
								className="relative flex-[0_0_85%] cursor-zoom-in border-none bg-transparent p-0"
								onClick={() => {
									setPhotoIndex(index);
									setVisible(true);
								}}
								aria-label={`View ${image.alt || `Image ${index + 1}`}`}
							>
								<img
									src={image.thumb || image.src}
									alt={image.alt || `Image ${index + 1}`}
									className="h-full w-full rounded-lg object-cover"
								/>
							</button>
						))}
					</div>
				</div>
			</div>

			<PhotoSlider
				images={images.map((img) => ({ src: img.src, key: img.src }))}
				visible={visible}
				onClose={() => setVisible(false)}
				index={photoIndex}
				onIndexChange={setPhotoIndex}
				maskOpacity={0.9}
				{...photoViewConfig}
			/>
		</>
	);
};
