// 'use client';
// import useEmblaCarousel from 'embla-carousel-react';
// import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

// import { useCallback, useEffect, useState } from 'react';
// import { EscortCard } from '@/components/escorts/Card';

// export const Carousel = () => {
// 	const [emblaRef, emblaApi] = useEmblaCarousel(
// 		{
// 			align: 'center',
// 			loop: false,
// 			duration: 20,
// 			axis: 'x',
// 			skipSnaps: true,
// 		},
// 		[WheelGesturesPlugin()],
// 	);

// 	const [selectedIndex, setSelectedIndex] = useState(0);
// 	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

// 	const onPress = (index: number) => {
// 		emblaApi?.scrollTo(index);
// 	};

// 	const onSelect = useCallback(() => {
// 		if (!emblaApi) return;
// 		setSelectedIndex(emblaApi.selectedScrollSnap());
// 	}, [emblaApi]);

// 	useEffect(() => {
// 		if (!emblaApi) return;
// 		onSelect();
// 		setScrollSnaps(emblaApi.scrollSnapList());
// 		emblaApi.on('select', onSelect);
// 		emblaApi.on('reInit', onSelect);
// 		return () => {
// 			emblaApi.off('select', onSelect);
// 			emblaApi.off('reInit', onSelect);
// 		};
// 	}, [emblaApi, onSelect]);

// 	return (
// 		<>
// 			<div ref={emblaRef}>
// 				<div className="flex select-none gap-4">
// 					{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
// 						<div className="flex-[0_0_70%] md:flex-[0_0_30%]" key={item}>
// 							<EscortCard />
// 						</div>
// 					))}
// 				</div>
// 			</div>

// 			{/* <div className="flex justify-center gap-2">
// 				{scrollSnaps.map((_, index) => {
// 					const isActive = index === selectedIndex;
// 					return (
// 						<button
// 							key={index}
// 							onClick={() => onPress(index)}
// 							type="button"
// 							className={`h-3 cursor-pointer rounded-full bg-primary transition-all duration-300 ${isActive ? 'w-7 opacity-100' : 'w-3 opacity-30'}`}
// 						/>
// 					);
// 				})}
// 			</div> */}
// 		</>
// 	);
// };
