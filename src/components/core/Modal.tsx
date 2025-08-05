import {
	type ReactNode,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';

export interface ModalRef {
	open: () => void;
	close: () => void;
	toggle: () => void;
	isOpen: boolean;
}

interface ModalProps {
	children: ReactNode;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	className?: string;
	ref?: React.RefObject<ModalRef | null>;
	onClose?: () => void;
	position?: 'center' | 'top';
	topOffset?: string; // ex: "top-10", "top-32", etc
}

export function Modal({
	children,
	size = 'md',
	className,
	ref: externalRef,
	onClose,
	position = 'center',
	topOffset = 'top-20',
}: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
		full: 'max-w-[90vw] max-h-[90vh]',
	};

	useImperativeHandle(
		externalRef,
		() => ({
			open: () => setIsOpen(true),
			close: () => handleSmoothClose(),
			toggle: () => setIsOpen((prev) => !prev),
			isOpen,
		}),
		[isOpen],
	);

	const handleSmoothClose = () => {
		if (isAnimating) return;

		setIsAnimating(true);

		if (modalRef.current) {
			modalRef.current.style.transition =
				'opacity 0.3s cubic-bezier(0.32, 0.72, 0, 1), transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
			modalRef.current.style.opacity = '0';
			modalRef.current.style.transform =
				position === 'top'
					? 'translateX(-50%) translateY(-20%) scale(0.95)'
					: 'translate(-50%, -48%) scale(0.95)';
		}

		if (overlayRef.current) {
			overlayRef.current.style.transition =
				'opacity 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
			overlayRef.current.style.opacity = '0';
		}

		setTimeout(() => {
			setIsOpen(false);
			setIsAnimating(false);
			onClose?.();
		}, 300);
	};

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				handleSmoothClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);

			const scrollbarWidth =
				window.innerWidth - document.documentElement.clientWidth;

			document.documentElement.style.setProperty(
				'--scrollbar-width',
				`${scrollbarWidth}px`,
			);

			document.body.style.overflow = 'hidden';
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
			document.body.style.paddingRight = '0px';
			document.documentElement.style.removeProperty('--scrollbar-width');
		};
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			setIsAnimating(true);

			if (modalRef.current) {
				modalRef.current.style.transition = 'none';
				modalRef.current.style.opacity = '0';
				modalRef.current.style.transform =
					position === 'top'
						? 'translateX(-50%) translateY(0) scale(0.95)'
						: 'translate(-50%, -50%) scale(0.95)';
			}

			if (overlayRef.current) {
				overlayRef.current.style.transition = 'none';
				overlayRef.current.style.opacity = '0';
			}

			requestAnimationFrame(() => {
				if (modalRef.current) {
					modalRef.current.style.transition =
						'opacity 0.3s cubic-bezier(0.32, 0.72, 0, 1), transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
					modalRef.current.style.opacity = '1';
					modalRef.current.style.transform =
						position === 'top'
							? 'translateX(-50%) translateY(0) scale(1)'
							: 'translate(-50%, -50%) scale(1)';
				}

				if (overlayRef.current) {
					overlayRef.current.style.transition =
						'opacity 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
					overlayRef.current.style.opacity = '1';
				}

				setTimeout(() => {
					setIsAnimating(false);
				}, 300);
			});
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<>
			<div
				ref={overlayRef}
				onClick={handleSmoothClose}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						handleSmoothClose();
					}
				}}
				role="button"
				tabIndex={0}
				aria-label="Close modal"
				className="fixed inset-0 z-90 bg-black/50"
				style={{ backdropFilter: 'blur(4px)' }}
			/>

			<div
				ref={modalRef}
				className={cn(
					'fixed left-1/2 z-100 w-full px-4',
					position === 'top' ? topOffset : 'top-1/2',
					sizeClasses[size],
					className,
				)}
				style={{
					transform:
						position === 'top' ? 'translateX(-50%)' : 'translate(-50%, -50%)',
				}}
			>
				<Card className="overflow-y-auto rounded-xl bg-accent p-6">
					{children}
				</Card>
			</div>
		</>
	);
}
