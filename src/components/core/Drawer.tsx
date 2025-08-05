import {
	type ReactNode,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { useSlot, useStyled } from 'use-styled';
import { Card } from './Card';
import { Icon } from './Icon';

export interface DrawerRef {
	open: () => void;
	close: () => void;
	toggle: () => void;
	isOpen: boolean;
}

interface DrawerProps {
	children: ReactNode;
	position?: 'left' | 'right';
	size?: 'full' | number | string;
	disableDrag?: boolean;
	ref?: React.RefObject<DrawerRef | null>;
}

const DrawerRoot = ({
	children,
	position = 'right',
	size = 400,
	disableDrag,
	ref: externalRef,
}: DrawerProps) => {
	const internalRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStartX, setDragStartX] = useState(0);
	const [currentX, setCurrentX] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	// Calculate width based on size prop
	const getWidth = () => {
		if (size === 'full') return '100%';
		if (typeof size === 'number') return `${size}px`;
		return size; // String with unit (%, rem, vw, etc)
	};

	// Intelligent drag detection
	const shouldAutoDisableDrag = () => {
		if (disableDrag) return true;
		if (size === 'full') return true;
		if (typeof size === 'string') {
			// Disable drag for 100% or >= 90%
			const match = size.match(/^(\d+)%$/);
			if (match && Number.parseInt(match[1]) >= 90) return true;
		}
		return false;
	};

	const width = getWidth();
	const shouldDisableDrag = shouldAutoDisableDrag();

	// Expose imperative methods through ref
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

	// Smooth close animation
	const handleSmoothClose = () => {
		if (isAnimating) return; // Prevent double closing

		setIsAnimating(true);

		// Animate drawer out
		if (internalRef.current) {
			const exitPosition = position === 'right' ? '100%' : '-100%';
			internalRef.current.style.transition =
				'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
			internalRef.current.style.transform = `translateX(${exitPosition})`;
		}

		// Animate overlay out
		if (overlayRef.current) {
			overlayRef.current.style.transition =
				'opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
			overlayRef.current.style.opacity = '0';
		}

		// Call onClose after animation completes
		setTimeout(() => {
			setIsOpen(false);
			setIsAnimating(false);
		}, 500);
	};

	// Close on ESC and handle body scroll
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				handleSmoothClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);

			// Calculate scrollbar width to prevent layout shift
			const scrollbarWidth =
				window.innerWidth - document.documentElement.clientWidth;

			// Set CSS variable for scrollbar width
			document.documentElement.style.setProperty(
				'--scrollbar-width',
				`${scrollbarWidth}px`,
			);

			// Prevent body scroll and compensate for scrollbar
			document.body.style.overflow = 'hidden';
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
			document.body.style.paddingRight = '0px';

			// Remove CSS variable
			document.documentElement.style.removeProperty('--scrollbar-width');
		};
	}, [isOpen]);

	// Handle entrance animation
	useEffect(() => {
		if (isOpen) {
			setIsAnimating(true);

			// Start from off-screen position
			if (internalRef.current) {
				const startPosition = position === 'right' ? '100%' : '-100%';
				internalRef.current.style.transition = 'none';
				internalRef.current.style.transform = `translateX(${startPosition})`;
			}

			// Start overlay from transparent
			if (overlayRef.current) {
				overlayRef.current.style.transition = 'none';
				overlayRef.current.style.opacity = '0';
			}

			// Animate to final position on next frame
			requestAnimationFrame(() => {
				if (internalRef.current) {
					internalRef.current.style.transition =
						'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
					internalRef.current.style.transform = 'translateX(0px)';
				}

				if (overlayRef.current) {
					overlayRef.current.style.transition =
						'opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
					overlayRef.current.style.opacity = '1';
				}

				// Animation complete
				setTimeout(() => {
					setIsAnimating(false);
				}, 500);
			});
		}
	}, [isOpen, position]);

	// Handle drag start
	const handlePointerDown = (e: React.PointerEvent) => {
		if (isDragging || shouldDisableDrag) return; // Prevent multi-touch issues and check if drag is disabled

		setIsDragging(true);
		setDragStartX(e.clientX);
		setCurrentX(e.clientX);

		if (internalRef.current) {
			internalRef.current.style.transition = 'none';
		}
	};

	// Handle drag move
	const handlePointerMove = (e: React.PointerEvent) => {
		if (!isDragging || shouldDisableDrag) return;

		const deltaX = e.clientX - dragStartX;

		// Block movement in wrong direction completely
		let dragDistance = 0;

		if (position === 'right' && deltaX > 0) {
			// Right drawer: only allow drag right (positive)
			dragDistance = deltaX;
		} else if (position === 'left' && deltaX < 0) {
			// Left drawer: only allow drag left (negative)
			dragDistance = deltaX;
		} else {
			// Wrong direction: no movement allowed
			return;
		}

		// Apply transform directly to element (performance optimization from Emil's docs)
		if (internalRef.current) {
			internalRef.current.style.transform = `translateX(${dragDistance}px)`;
		}

		// Update overlay opacity based on drag progress
		if (overlayRef.current) {
			const progress = Math.abs(dragDistance) / 200; // 200px for full fade
			const opacity = Math.max(0, 1 - progress);
			overlayRef.current.style.opacity = opacity.toString();
		}

		setCurrentX(e.clientX);
	};

	// Handle drag end
	const handlePointerUp = () => {
		if (!isDragging || shouldDisableDrag) return;

		const deltaX = currentX - dragStartX;
		const velocity = Math.abs(deltaX) / 100; // Simple velocity calculation

		// Determine if should close based on distance and direction
		const threshold = 100; // pixels
		const shouldClose =
			(position === 'right' && deltaX > threshold) || // Right drawer: drag right to close
			(position === 'left' && deltaX < -threshold) || // Left drawer: drag left to close
			velocity > 3; // High velocity threshold

		if (shouldClose) {
			// Use smooth close animation
			handleSmoothClose();
		} else {
			// Return to original position
			if (internalRef.current) {
				internalRef.current.style.transition =
					'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
				internalRef.current.style.transform = 'translateX(0px)';
			}
			if (overlayRef.current) {
				overlayRef.current.style.transition =
					'opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
				overlayRef.current.style.opacity = '1';
			}
		}

		setIsDragging(false);
	};

	if (!isOpen) return null;

	return (
		<>
			{/* Overlay */}
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
				aria-label="Close drawer"
				className="fixed inset-0 z-90 bg-black/50"
				style={{ backdropFilter: 'blur(4px)' }}
			/>

			{/* Drawer */}
			<div
				ref={internalRef}
				className="fixed top-0 z-100 flex h-full flex-col p-4"
				style={{
					[position]: 0,
					width,
				}}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
			>
				<div className="absolute top-7 right-3 h-10 w-10 cursor-pointer">
					<Icon name="Close" size="24" onClick={handleSmoothClose} />
				</div>
				{children}
			</div>
		</>
	);
};

const DrawerContent = useStyled(Card, {
	base: {
		className: 'h-full flex-1 overflow-y-auto rounded-xl bg-accent p-4',
	},
});

export const Drawer = useSlot(DrawerRoot, {
	Content: DrawerContent,
});
