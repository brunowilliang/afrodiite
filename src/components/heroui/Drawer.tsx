import {
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	Drawer as HeroDrawer,
	DrawerProps as HeroDrawerProps,
} from '@heroui/react';
import * as React from 'react';
import { useSlot } from 'use-styled';

export type DrawerRef = {
	open: () => void;
	close: () => void;
	toggle: () => void;
	setOpen: (value: boolean) => void;
	isOpen: () => boolean;
};

type Props = Omit<HeroDrawerProps, 'isOpen' | 'onOpenChange' | 'ref'> & {
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	onOpen?: () => void;
	onClose?: () => void;
	ref?: React.RefObject<DrawerRef | null>;
};

function DrawerRoot({
	isOpen: isOpenProp,
	onOpenChange,
	onOpen,
	onClose,
	ref,
	...props
}: Props) {
	const [internalOpen, setInternalOpen] = React.useState<boolean>(
		Boolean(isOpenProp),
	);

	const currentOpen = (isOpenProp ?? internalOpen) as boolean;

	function emitOpenChange(next: boolean) {
		if (onOpenChange) {
			onOpenChange(next);
		} else {
			setInternalOpen(next);
			if (next) onOpen?.();
			else onClose?.();
		}
	}

	function handleOpenChange(next: boolean) {
		emitOpenChange(next);
	}

	// Imperative control via explicit prop (no forwardRef per project rules)
	if (ref) {
		ref.current = {
			open: () => emitOpenChange(true),
			close: () => emitOpenChange(false),
			toggle: () => emitOpenChange(!currentOpen),
			setOpen: (v: boolean) => emitOpenChange(v),
			isOpen: () => Boolean(currentOpen),
		};
	}

	return (
		<HeroDrawer
			isOpen={Boolean(currentOpen)}
			onOpenChange={handleOpenChange}
			backdrop={'blur'}
			className="bg-background"
			classNames={{
				backdrop: 'bg-black/20',
			}}
			{...props}
		/>
	);
}

export const Drawer = useSlot(DrawerRoot, {
	Content: DrawerContent,
	Header: DrawerHeader,
	Body: DrawerBody,
	Footer: DrawerFooter,
});
