import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';

export type SavedItem = { kind: 'saved'; key: string; url: string; id: string };
export type NewItem = { kind: 'new'; key: string; url: string; file: File };
export type DisplayItem = SavedItem | NewItem;

type Props = {
	id: string;
	item: DisplayItem;
	onRemove?: () => void;
	onError?: () => void;
};

export const DragCard = ({ id, item, onRemove, onError }: Props) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id,
		transition: { duration: 0, easing: 'cubic-bezier(0.16,1,0.3,1)' },
	});

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition: transition ?? 'transform 0ms cubic-bezier(0.16,1,0.3,1)',
		zIndex: isDragging ? 10 : undefined,
		cursor: 'grab',
		position: 'relative',
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="relative"
		>
			<motion.div
				layout
				animate={{ opacity: isDragging ? 0.3 : 1 }}
				exit={{ opacity: 0 }}
			>
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
				{onRemove ? (
					<button
						type="button"
						className="absolute top-2 right-2 rounded bg-black/60 px-2 py-1 text-white text-xs"
						onClick={onRemove}
					>
						Remover
					</button>
				) : null}
			</motion.div>
		</div>
	);
};
