import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardFooter, Image } from '@heroui/react';
import { motion } from 'motion/react';
import { Button } from '@/components/core/Button';
import { Icon } from '@/components/core/Icon';

export type SavedItem = { kind: 'saved'; key: string; url: string; id: string };
export type NewItem = { kind: 'new'; key: string; url: string; file: File };
export type DisplayItem = SavedItem | NewItem;

type Props = {
	id: string;
	item: DisplayItem;
	onDelete?: () => void;
	onError?: () => void;
	progress?: number;
	disabled?: boolean;
	isPrimary?: boolean;
	onPreview?: () => void;
};

export const DragCard = ({
	id,
	item,
	onDelete,
	onError,
	progress,
	disabled,
	isPrimary,
	onPreview,
}: Props) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id,
		disabled,
	});

	return (
		<div
			ref={setNodeRef}
			className={`relative ${disabled ? 'cursor-default' : 'cursor-grab'}`}
			style={{
				transform: CSS.Transform.toString(transform),
				transition: transition ?? 'transform 0ms linear',
			}}
			{...attributes}
			{...listeners}
		>
			<motion.div
				layout
				animate={{ opacity: isDragging ? 0.3 : 1 }}
				exit={{ opacity: 0 }}
			>
				<Card
					isFooterBlurred
					className="overflow-visible border-none shadow-none"
					radius="lg"
				>
					<Image
						onClick={() => {
							if (!isDragging) onPreview?.();
						}}
						src={item.url}
						alt={
							item.kind === 'new'
								? (item as NewItem).file.name
								: (item as SavedItem).id
						}
						loading="lazy"
						isLoading={!!progress}
						className="aspect-[3/4] cursor-zoom-in object-cover"
						isBlurred
						onError={onError}
					/>
					{onDelete && (
						<Button
							isIconOnly
							size="md"
							onClick={onDelete}
							isLoading={false}
							aria-label="delete"
							color="default"
							variant="solid"
							className="absolute top-2 right-2 bottom-1 z-10 overflow-hidden rounded-large border-1 border-white/20 bg-white/20 p-0 shadow-small backdrop-blur-xs"
						>
							<Icon name="Cancel" size="18" className="text-white" />
						</Button>
					)}
					{isPrimary && !isDragging && (
						<CardFooter className="fade-in absolute bottom-1 z-10 ml-2.5 w-[calc(100%_-_20px)] animate-in overflow-hidden rounded-large border-1 border-white/20 p-0 shadow-small duration-400">
							<p className="w-full py-2.5 text-center text-tiny text-white/80">
								Principal
							</p>
						</CardFooter>
					)}
				</Card>
			</motion.div>
		</div>
	);
};
