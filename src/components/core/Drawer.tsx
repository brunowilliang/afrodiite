import {
	type ReactNode,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { Card } from './Card';

export interface DrawerRef {
	open: () => void;
	close: () => void;
	toggle: () => void;
	isOpen: boolean;
}

interface DrawerProps {
	children: ReactNode;
	position?: 'left' | 'right';
	width?: string;
	ref?: React.RefObject<DrawerRef | null>;
}

export function Drawer({
	children,
	position = 'right',
	width = '320px',
	ref: externalRef,
}: DrawerProps) {
	const internalRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStartX, setDragStartX] = useState(0);
	const [currentX, setCurrentX] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

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
		if (isDragging) return; // Prevent multi-touch issues

		setIsDragging(true);
		setDragStartX(e.clientX);
		setCurrentX(e.clientX);

		if (internalRef.current) {
			internalRef.current.style.transition = 'none';
		}
	};

	// Handle drag move
	const handlePointerMove = (e: React.PointerEvent) => {
		if (!isDragging) return;

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
		if (!isDragging) return;

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
				<Card className="h-full flex-1 overflow-y-auto rounded-xl bg-accent p-4">
					{children}
				</Card>
			</div>
		</>
	);
}
