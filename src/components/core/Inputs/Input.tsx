import type * as React from 'react';
import { useMemo, useRef } from 'react';
import { cn } from '@/utils/cn';
import { Icon, type IconProps } from '../Icon';

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	helperText?: string;
	errorText?: string;
	iconName?: IconProps['name'];
	inputClassName?: string;
	ref?: React.Ref<HTMLInputElement>; // external ref to control inner input
};

export const Input = ({
	label,
	helperText,
	errorText,
	iconName,
	className,
	inputClassName,
	ref,
	...inputProps
}: TextInputProps) => {
	const localRef = useRef<HTMLInputElement>(null);

	const mergedRef = useMemo(() => {
		return (el: HTMLInputElement | null) => {
			(localRef as any).current = el;
			if (typeof ref === 'function') {
				ref(el);
			} else if (ref && 'current' in (ref as any)) {
				(ref as any).current = el;
			}
		};
	}, [ref]);
	const isDisabled = Boolean(inputProps.disabled);

	return (
		<div
			className={cn('group flex flex-col gap-2', className)}
			onMouseDown={(e) => {
				// If clicking inside the input, do not block native selection
				const target = e.target as HTMLElement;
				if (target.closest('input')) return;
				// If clicking on children (icon/label), let default behavior happen
				if (e.target !== e.currentTarget) return;
				// Prevent default only when clicking the bare container to focus
				e.preventDefault();
				if (!localRef.current) return;
				if (document.activeElement === localRef.current) return;
				localRef.current.focus();
			}}
		>
			{/* input */}
			<div
				className={cn(
					'group flex h-[60px] w-full flex-row items-center gap-3 rounded-lg border border-accent-10 bg-accent px-3',
					'focus-within:border-text-secondary',
					'group-has-[:invalid]:border-danger group-has-[[aria-invalid=true]]:border-danger',
					isDisabled && 'opacity-50',
				)}
			>
				{iconName ? (
					<Icon
						name={iconName}
						className={cn(
							'size-5 text-text-secondary/50 group-focus-within:text-text-secondary',
						)}
					/>
				) : null}
				<div className="flex w-full flex-col justify-center">
					{label ? (
						<label
							className={cn(
								'w-full text-sm text-text-secondary/50',
								'group-focus-within:text-text-secondary',
							)}
						>
							{label}
						</label>
					) : null}
					<input
						type="text"
						ref={mergedRef}
						className={cn(
							'peer w-full text-text-primary outline-0',
							'placeholder:text-text-secondary/50',
							inputClassName,
						)}
						{...inputProps}
					/>
				</div>
			</div>
			{/* fim input */}

			{/* helper text */}
			{helperText ? (
				<span className="px-3 text-sm text-text-secondary/70 group-has-[:invalid]:hidden group-has-[[aria-invalid=true]]:hidden">
					{helperText}
				</span>
			) : null}
			{/* fim helper text */}

			{/* error text */}
			{errorText ? (
				<span className="hidden px-3 text-danger/70 text-sm group-has-[:invalid]:block group-has-[[aria-invalid=true]]:block">
					{errorText}
				</span>
			) : null}
			{/* fim error text */}
		</div>
	);
};
