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
import { type DisplayItem, DragCard } from './DragCard';

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

	const keyToItem = useMemo(() => {
		const map = new Map<string, DisplayItem>();
		items.forEach((it) => map.set(it.key, it));
		return map;
	}, [items]);

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
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
		>
			<SortableContext items={order} strategy={rectSortingStrategy}>
				<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
					<AnimatePresence initial>
						{order.map((k) => (
							<DragCard
								key={k}
								id={k}
								item={keyToItem.get(k) as DisplayItem}
								onDelete={() => onDelete(k)}
								onError={() => onDelete(k)}
								progress={progress?.get(k) ?? 0}
								disabled={!!disabled}
								isPrimary={order[0] === k}
							/>
						))}
					</AnimatePresence>
				</div>
			</SortableContext>

			<DragOverlay>
				<DragCard
					id={activeId ?? ''}
					item={keyToItem.get(activeId ?? '') as DisplayItem}
				/>
			</DragOverlay>
		</DndContext>
	);
};

export default SortableGallery;
