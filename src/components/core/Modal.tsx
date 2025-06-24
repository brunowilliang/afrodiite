"use client";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import {
	type ReactNode,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";

export interface ModalRef {
	open: () => void;
	close: () => void;
}

export const Modal = ({
	children,
	ref,
}: {
	children: ReactNode;
	ref?: React.Ref<ModalRef>;
}) => {
	const [open, setOpen] = useState(false);

	useImperativeHandle(ref, () => ({
		open: () => setOpen(true),
		close: () => setOpen(false),
	}));

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [open]);

	const modalRef = useRef<HTMLDivElement>(null);
	useOutsideClick(modalRef, () => setOpen(false));

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
						backdropFilter: "blur(5px)",
					}}
					exit={{
						opacity: 0,
						backdropFilter: "blur(0px)",
					}}
					className="fixed inset-0 z-50 flex h-full w-full items-center justify-center [perspective:800px] [transform-style:preserve-3d]"
				>
					<Overlay />

					<motion.div
						ref={modalRef}
						className={cn(
							"relative z-50 flex max-h-[90%] min-h-[50%] flex-1 flex-col overflow-hidden border border-transparente md:max-w-[40%] md:rounded-2xl",
						)}
						initial={{
							opacity: 0,
							scale: 0.5,
						}}
						animate={{
							opacity: 1,
							scale: 1,
						}}
						exit={{
							opacity: 0,
							scale: 0.8,
						}}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 15,
						}}
					>
						<CloseIcon onClose={() => setOpen(false)} />
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export const ModalTrigger = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => {
	return (
		<button
			type="button"
			className={cn(
				"relative overflow-hidden rounded-md px-4 py-2 text-center text-black dark:text-white",
				className,
			)}
		>
			{children}
		</button>
	);
};

export const ModalContent = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn("flex flex-1 flex-col p-8 md:p-10", className)}>
			{children}
		</div>
	);
};

export const ModalFooter = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				"flex justify-end bg-gray-100 p-4 dark:bg-neutral-900",
				className,
			)}
		>
			{children}
		</div>
	);
};

const Overlay = ({ className }: { className?: string }) => {
	return (
		<motion.div
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
				backdropFilter: "blur(10px)",
			}}
			exit={{
				opacity: 0,
				backdropFilter: "blur(0px)",
			}}
			className={`fixed inset-0 z-50 h-full w-full bg-opacity-50 ${className}`}
		/>
	);
};

const CloseIcon = ({ onClose }: { onClose: () => void }) => {
	return (
		<button
			type="button"
			onClick={onClose}
			className="group absolute top-4 right-4"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-4 w-4 text-black transition duration-200 group-hover:rotate-3 group-hover:scale-125 dark:text-white"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M18 6l-12 12" />
				<path d="M6 6l12 12" />
			</svg>
		</button>
	);
};

// Hook to detect clicks outside of a component.
export const useOutsideClick = (
	ref: React.RefObject<HTMLDivElement | null>,
	callback: Function,
) => {
	useEffect(() => {
		const listener = (event: any) => {
			if (!ref.current || ref.current.contains(event.target)) {
				return;
			}
			callback(event);
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, callback]);
};
