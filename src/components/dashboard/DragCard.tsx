import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '../core/Icon';
import { ImageUploading } from '../core/ImageUploader';

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
};

export const DragCard = ({
	id,
	item,
	onDelete,
	onError,
	progress,
	disabled,
	isPrimary,
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
			className={`relative ${disabled ? 'cursor-default' : 'cursor-grab'}`}
			ref={setNodeRef}
			style={{
				transform: CSS.Transform.toString(transform),
				transition: transition ?? 'transform 0ms cubic-bezier(0.16,1,0.3,1)',
			}}
			{...attributes}
			{...listeners}
		>
			<motion.div
				layout
				animate={{ opacity: isDragging ? 0.5 : 1 }}
				exit={{ opacity: 0 }}
			>
				{onDelete ? (
					<button
						onClick={onDelete}
						className="absolute top-2 right-2 rounded-md bg-black/60 px-3 pt-2 pb-1 text-white text-xs"
					>
						<Icon name="Close" size="16" />
					</button>
				) : null}
				<img
					src={item.url}
					alt={
						item.kind === 'new'
							? (item as NewItem).file.name
							: (item as SavedItem).id
					}
					onError={onError}
					className="aspect-square w-full rounded-lg object-cover"
				/>
				<AnimatePresence initial={false}>
					{isPrimary && !isDragging ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							className="absolute bottom-0 left-0 w-full rounded-b-lg bg-primary/60"
						>
							<p className="py-1 text-center text-sm">Principal</p>
						</motion.div>
					) : null}
				</AnimatePresence>
				<ImageUploading progress={progress} />
			</motion.div>
		</div>
	);
};
