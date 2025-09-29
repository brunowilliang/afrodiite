'use client';

import { Card, Image } from '@heroui/react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Icon } from '@/components/core/Icon';
import { Stack } from '@/components/core/Stack';
import { cn } from '@/utils/cn';

interface Props {
	profile: IProfile.Select;
	className?: string;
}

export const EscortCard = ({ profile, className }: Props) => {
	// const router = useRouter();
	const [selectedIndex, setSelectedIndex] = useState(0);

	// Get only first 3 images sorted by order
	const previewImages = useMemo(() => {
		if (!profile.gallery || profile.gallery.length === 0) return [];

		return profile.gallery.sort((a, b) => a.order - b.order).slice(0, 3);
	}, [profile.gallery]);

	// Get 1h price if available
	const availablePrice = useMemo(() => {
		if (!profile.prices) return null;

		return profile.prices.find(
			(price) => price.slot === '1h' && price.is_available && !price.negotiated,
		);
	}, [profile.prices]);

	// Format price
	const formattedPrice = useMemo(() => {
		if (!availablePrice?.amount) {
			return availablePrice?.negotiated ? 'Negociável' : 'A consultar';
		}

		return availablePrice.amount.toLocaleString('pt-PT', {
			style: 'currency',
			currency: availablePrice.currency || 'EUR',
			minimumFractionDigits: 0,
		});
	}, [availablePrice]);

	const handleDotClick = (e: React.MouseEvent, index: number) => {
		e.preventDefault();
		e.stopPropagation();
		setSelectedIndex(index);
	};

	const handlePrevious = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setSelectedIndex((prev) =>
			prev === 0 ? previewImages.length - 1 : prev - 1,
		);
	};

	const handleNext = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setSelectedIndex((prev) =>
			prev === previewImages.length - 1 ? 0 : prev + 1,
		);
	};

	// If no images, show placeholder
	if (previewImages.length === 0) {
		return (
			<Card
				isHoverable
				className={cn(
					'cursor-pointer overflow-visible border-none bg-transparent shadow-none',
					className,
				)}
				radius="lg"
			>
				<div className="relative flex aspect-[3/4] items-center justify-center rounded-lg bg-gray-200">
					<p className="text-default-600 text-sm">Sem imagens</p>
				</div>
				<Stack className="flex-row justify-between gap-1 p-2">
					<Stack className="-space-y-1 w-full min-w-0 flex-1 items-start">
						<h3 className="w-full truncate font-normal text-default-800 text-md md:text-lg">
							{profile.artist_name || profile.name}
						</h3>
						<p className="w-full truncate text-default-600 text-xs md:text-sm">
							{profile.city}, {profile.district}
						</p>
					</Stack>
					<Stack className="-space-y-1 flex-col items-end">
						{availablePrice && (
							<>
								<p className="font-normal text-default-800 text-xs md:text-sm">
									{availablePrice.slot}
								</p>
								<p className="font-normal text-default-800 text-md md:text-lg">
									{formattedPrice}
								</p>
							</>
						)}
					</Stack>
				</Stack>
			</Card>
		);
	}

	return (
		<Link
			href={`/acompanhante/${profile.public_id}/${profile.slug}`}
			prefetch="unstable_forceStale"
		>
			<Card
				isHoverable
				className={cn(
					'cursor-pointer overflow-visible border-none bg-transparent shadow-none',
					className,
				)}
				radius="lg"
			>
				<div className="relative aspect-[3/4] rounded-lg">
					{previewImages.map((image, index) => (
						<motion.div
							key={image.id}
							initial={{ opacity: index === 0 ? 1 : 0 }}
							animate={{
								opacity: index === selectedIndex ? 1 : 0,
								zIndex: index === selectedIndex ? 1 : 0,
							}}
							transition={{ duration: 0.5, ease: 'easeInOut' }}
							className="absolute inset-0"
							style={{
								pointerEvents: index === selectedIndex ? 'auto' : 'none',
							}}
						>
							<Image
								alt={profile.artist_name || profile.name || ''}
								className="aspect-[3/4] cursor-pointer object-cover"
								radius="lg"
								isBlurred
								isZoomed
								shadow="sm"
								src={image.url}
								width="100%"
								height="100%"
								loading="eager"
								decoding="auto"
							/>
						</motion.div>
					))}

					{previewImages.length > 1 && (
						<>
							{/* Navigation zones */}
							<button
								type="button"
								className={cn(
									'absolute top-0 left-0 z-10 h-full w-1/6 rounded-l-xl',
									'bg-transparent transition-all duration-300',
									'hover:bg-gradient-to-r hover:from-black/20 hover:to-transparent',
								)}
								onClick={handlePrevious}
								aria-label="Imagem anterior"
							/>
							<button
								type="button"
								className={cn(
									'absolute top-0 right-0 z-10 h-full w-1/6 rounded-r-xl',
									'bg-transparent transition-all duration-300',
									'hover:bg-gradient-to-l hover:from-black/20 hover:to-transparent',
								)}
								onClick={handleNext}
								aria-label="Próxima imagem"
							/>

							{/* Dots indicator */}
							<div
								className={cn(
									'absolute bottom-2 left-1/2 z-10',
									'-translate-x-1/2 flex gap-1.5',
								)}
							>
								{previewImages.map((_, index) => (
									<button
										key={index}
										type="button"
										className={`h-2 rounded-full bg-white/80 transition-all duration-300 ${
											index === selectedIndex ? 'w-7' : 'w-2'
										}`}
										onClick={(e) => handleDotClick(e, index)}
										aria-label={`Ir para imagem ${index + 1}`}
									/>
								))}
							</div>
						</>
					)}
				</div>
				<Stack className="flex-row justify-between gap-1 p-2">
					<Stack className="-space-y-1 w-full min-w-0 flex-1 items-start">
						<h3 className="w-full truncate font-normal text-default-800 text-md md:text-lg">
							{profile.artist_name || profile.name}
						</h3>
						<p className="w-full truncate text-default-600 text-xs md:text-sm">
							{profile.city}, {profile.district}
						</p>
					</Stack>
					<Stack className="-space-y-1 flex-col items-end">
						{availablePrice ? (
							<>
								<p className="font-normal text-default-800 text-xs md:text-sm">
									{availablePrice.slot}
								</p>
								<p className="font-normal text-default-800 text-md md:text-lg">
									{formattedPrice}
								</p>
							</>
						) : (
							<div className="centered flex size-full">
								<Icon name="ArrowRight" className="text-default-600 text-xl" />
							</div>
						)}
					</Stack>
				</Stack>
			</Card>
		</Link>
	);
};
