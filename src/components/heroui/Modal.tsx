import {
	Modal as HeroModal,
	ModalProps as HeroModalProps,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';
import * as React from 'react';
import { useSlot } from 'use-styled';

export type ModalRef = {
	open: () => void;
	close: () => void;
	toggle: () => void;
	setOpen: (value: boolean) => void;
	isOpen: () => boolean;
};

type Props = Omit<HeroModalProps, 'isOpen' | 'onOpenChange' | 'ref'> & {
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	onOpen?: () => void;
	onClose?: () => void;
	ref?: React.RefObject<ModalRef | null>;
};

function ModalRoot({
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
		<HeroModal
			isOpen={Boolean(currentOpen)}
			onOpenChange={handleOpenChange}
			placement="top-center"
			backdrop={'blur'}
			className="bg-content1"
			scrollBehavior="inside"
			shouldBlockScroll={false}
			classNames={{
				backdrop: 'bg-black/50',
			}}
			{...props}
		/>
	);
}

export const Modal = useSlot(ModalRoot, {
	Content: ModalContent,
	Header: ModalHeader,
	Body: ModalBody,
	Footer: ModalFooter,
});
