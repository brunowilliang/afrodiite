'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

export const ImageCarousel = () => {
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
		<div className="w-full flex-shrink-0 overflow-hidden rounded-lg">
			<div ref={emblaRef}>
				<div className="flex h-72 select-none gap-1">
					{[1, 2, 3].map((item) => (
						<div className="relative flex-[0_0_85%]" key={item}>
							<img
								src="/assets/profile.png"
								alt="Alycia Bittencourt"
								className="h-full w-full rounded-lg object-cover"
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
