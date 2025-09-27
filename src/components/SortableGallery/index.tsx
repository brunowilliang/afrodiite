import {
	closestCenter,
	DndContext,
	DragOverlay,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { AnimatePresence } from 'motion/react';
import { useMemo, useState } from 'react';
import { PhotoSlider } from 'react-photo-view';
import { type DisplayItem, DragCard } from './Card';

type Props = {
	items: DisplayItem[];
	order: string[];
	onOrderChange: (next: string[]) => void;
	onDelete: (key: string) => void;
	progress?: Map<string, number>;
	disabled?: boolean;
};

export const SortableGallery = ({
	items,
	order,
	onOrderChange,
	onDelete,
	progress,
	disabled,
}: Props) => {
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
	);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [index, setIndex] = useState(0);

	const keyToItem = useMemo(() => {
		const map = new Map<string, DisplayItem>();
		items.forEach((it) => map.set(it.key, it));
		return map;
	}, [items]);

	const urls = useMemo(
		() => order.map((k) => keyToItem.get(k)?.url || ''),
		[order, keyToItem],
	);

	const onDragStart = (e: any) => setActiveId(String(e.active.id));
	const onDragEnd = (e: any) => {
		const { active, over } = e;
		if (!over || active.id === over.id) {
			setActiveId(null);
			return;
		}
		const from = order.findIndex((k) => k === String(active.id));
		const to = order.findIndex((k) => k === String(over.id));
		if (from !== -1 && to !== -1 && from !== to) {
			const next = [...order];
			const [moved] = next.splice(from, 1);
			next.splice(to, 0, moved);
			onOrderChange(next);
		}
		setActiveId(null);
	};

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
			>
				<SortableContext items={order} strategy={rectSortingStrategy}>
					<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
						<AnimatePresence initial>
							{order.map((k, i) => (
								<DragCard
									key={k}
									id={k}
									item={keyToItem.get(k) as DisplayItem}
									onDelete={() => onDelete(k)}
									onError={() => onDelete(k)}
									progress={progress?.get(k) ?? 0}
									disabled={!!disabled}
									isPrimary={order[0] === k}
									onPreview={() => {
										setIndex(i);
										setIsOpen(true);
									}}
								/>
							))}
						</AnimatePresence>
					</div>
				</SortableContext>

				<DragOverlay>
					{activeId ? (
						<DragCard
							id={activeId}
							item={keyToItem.get(activeId) as DisplayItem}
						/>
					) : null}
				</DragOverlay>
			</DndContext>

			<PhotoSlider
				images={urls.map((u) => ({ src: u, key: u }))}
				visible={isOpen}
				index={index}
				onIndexChange={setIndex}
				onClose={() => setIsOpen(false)}
				maskOpacity={0.5}
			/>
		</>
	);
};

export default SortableGallery;
