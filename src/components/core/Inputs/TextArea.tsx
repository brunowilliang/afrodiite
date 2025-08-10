import type * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/utils/cn';
import { Icon, type IconProps } from '../Icon';

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string;
	helperText?: string;
	errorText?: string;
	iconName?: IconProps['name'];
	textareaClassName?: string;
	ref?: React.Ref<HTMLTextAreaElement>; // external ref to control inner textarea
	autoGrow?: boolean; // default: true
};

export const TextArea = ({
	label,
	helperText,
	errorText,
	iconName,
	className,
	textareaClassName,
	ref,
	autoGrow = true,
	id,
	onInput,
	...textareaProps
}: TextAreaProps) => {
	const localRef = useRef<HTMLTextAreaElement>(null);

	const mergedRef = useMemo(() => {
		return (el: HTMLTextAreaElement | null) => {
			(localRef as any).current = el;
			if (typeof ref === 'function') {
				ref(el);
			} else if (ref && 'current' in (ref as any)) {
				(ref as any).current = el;
			}
		};
	}, [ref]);

	const isDisabled = Boolean(textareaProps.disabled);

	const resizeToContent = (el: HTMLTextAreaElement | null) => {
		if (!el) return;
		// Reset height to measure correct scrollHeight
		el.style.height = 'auto';
		// Add a small offset to avoid scrollbars due to rounding
		el.style.height = `${el.scrollHeight}px`;
	};

	useEffect(() => {
		if (!autoGrow) return;
		resizeToContent(localRef.current);
		// Also listen for font loading/layout changes
		const el = localRef.current;
		if (!el) return;
		const observer = new ResizeObserver(() => resizeToContent(el));
		observer.observe(el);
		return () => observer.disconnect();
	}, [autoGrow]);

	const describedById = useMemo(() => {
		if (!id) return undefined;
		if (errorText) return `${id}-error`;
		if (helperText) return `${id}-help`;
		return undefined;
	}, [id, helperText, errorText]);

	return (
		<div
			className={cn('group flex flex-col gap-2', className)}
			onMouseDown={(e) => {
				// If clicking inside the textarea, do not block native selection
				const target = e.target as HTMLElement;
				if (target.closest('textarea')) return;
				// If clicking on children (icon/label), let default behavior happen
				if (e.target !== e.currentTarget) return;
				// Prevent default only when clicking the bare container to focus
				e.preventDefault();
				if (!localRef.current) return;
				if (document.activeElement === localRef.current) return;
				localRef.current.focus();
			}}
		>
			{/* field */}
			<div
				className={cn(
					'group flex w-full items-start gap-3 rounded-lg border border-accent-10 bg-accent px-3 py-3',
					'focus-within:border-text-secondary',
					'group-has-[:invalid]:border-danger group-has-[[aria-invalid=true]]:border-danger',
					isDisabled && 'opacity-50',
				)}
			>
				{iconName ? (
					<Icon
						name={iconName}
						className={cn(
							'mt-1.5 size-5 text-text-secondary/50 group-focus-within:text-text-secondary',
						)}
					/>
				) : null}
				<div className="flex w-full flex-col">
					{label ? (
						<label
							htmlFor={id}
							className={cn(
								'w-full text-sm text-text-secondary/50',
								'group-focus-within:text-text-secondary',
							)}
						>
							{label}
						</label>
					) : null}
					<textarea
						id={id}
						ref={mergedRef}
						className={cn(
							'peer max-h-[300px] min-h-[200px] w-full resize-none text-text-primary outline-0',
							'placeholder:text-text-secondary/50',
							'bg-transparent leading-relaxed',
							textareaClassName,
						)}
						aria-describedby={describedById}
						onInput={(e) => {
							if (autoGrow) resizeToContent(e.currentTarget);
							if (onInput) onInput(e);
						}}
						{...textareaProps}
					/>
				</div>
			</div>

			{/* helper text */}
			{helperText ? (
				<span
					id={id ? `${id}-help` : undefined}
					className="px-3 text-sm text-text-secondary/70 group-has-[:invalid]:hidden group-has-[[aria-invalid=true]]:hidden"
				>
					{helperText}
				</span>
			) : null}

			{/* error text */}
			{errorText ? (
				<span
					id={id ? `${id}-error` : undefined}
					className="hidden px-3 text-danger/70 text-sm group-has-[:invalid]:block group-has-[[aria-invalid=true]]:block"
				>
					{errorText}
				</span>
			) : null}
		</div>
	);
};
