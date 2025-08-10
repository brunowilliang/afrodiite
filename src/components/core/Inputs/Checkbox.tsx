import type * as React from 'react';
import { useMemo, useRef } from 'react';
import { cn } from '@/utils/cn';

export type Props = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'type'
> & {
	onCheckedChange?: (checked: boolean) => void;
	ref?: React.Ref<HTMLInputElement>;
};

export const Checkbox = ({
	className,
	onChange,
	onCheckedChange,
	disabled,
	ref,
	...props
}: Props) => {
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

	const isDisabled = Boolean(disabled);

	return (
		<label
			className={cn('group flex cursor-pointer items-center', className)}
			aria-disabled={disabled}
			onMouseDown={(e) => {
				// prevent text selection; keep toggle behavior on label
				e.preventDefault();
				if (!localRef.current) return;
				// if already focused, do nothing
				if (document.activeElement === localRef.current) return;
				localRef.current.focus();
			}}
		>
			<input
				type="checkbox"
				className="peer sr-only"
				disabled={disabled}
				ref={mergedRef}
				onChange={(e) => {
					onCheckedChange?.(e.currentTarget.checked);
					onChange?.(e);
				}}
				{...props}
			/>
			<span
				className={cn(
					'relative flex h-8 w-8 items-center justify-center rounded-md border-2 shadow-md transition-all duration-500',
					'border-accent-10 bg-accent-10',
					'group-hover:scale-105 peer-checked:border-primary peer-checked:bg-primary peer-checked:p-2',
					isDisabled && 'opacity-50',
				)}
			/>
		</label>
	);
};
