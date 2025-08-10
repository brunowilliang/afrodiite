import { useMemo, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '../Icon';

type Option = { value: string; label: string };

type Props = {
	label?: string;
	placeholder?: string;
	options: Option[];
	className?: string;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	onBlur?: React.FocusEventHandler<HTMLDivElement | HTMLButtonElement>;
	id?: string;
	name?: string; // not used visually; kept for API parity
	'aria-invalid'?: boolean | 'true' | 'false';
	helperText?: string;
	errorText?: string;
};

export const Select = ({
	label,
	placeholder,
	options,
	className,
	value,
	defaultValue,
	onChange,
	onBlur,
	id,
	name: _name,
	'aria-invalid': ariaInvalid,
	helperText,
	errorText,
}: Props) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const btnRef = useRef<HTMLButtonElement>(null);
	const popRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);
	const [internalValue, setInternalValue] = useState<string | undefined>(
		defaultValue,
	);

	const isControlled = value !== undefined;
	const selectedValue = isControlled ? value : internalValue;

	const selected = useMemo(
		() => options.find((o) => o.value === selectedValue),
		[options, selectedValue],
	);
	const display = selected ? selected.label : (placeholder ?? 'Selecione...');
	const isSelected = Boolean(selected);

	return (
		<div
			ref={wrapperRef}
			className="group relative"
			onKeyDown={(e) => {
				if (e.key === 'Escape') setOpen(false);
			}}
			onBlurCapture={(e) => {
				const next = e.relatedTarget;
				if (!next || !wrapperRef.current?.contains(next)) {
					setOpen(false);
					if (onBlur) onBlur(e as any);
				}
			}}
		>
			<button
				type="button"
				ref={btnRef}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-invalid={ariaInvalid as any}
				id={id}
				onClick={() => {
					setOpen((v) => !v);
					queueMicrotask(() => btnRef.current?.focus());
				}}
				className={cn(
					'group relative flex h-[60px] w-full flex-row items-center gap-3 rounded-lg border border-accent-10 bg-accent px-3 outline-none',
					'focus-within:border-text-secondary',
					'group-has-[:invalid]:border-danger group-has-[[aria-invalid=true]]:border-danger',
					className,
				)}
			>
				<div className="flex w-full flex-col items-start justify-end">
					<label
						className={cn(
							'text-sm text-text-secondary/50',
							'group-focus-within:text-text-secondary',
						)}
					>
						{label}
					</label>
					<p
						className={cn(
							'truncate outline-0',
							isSelected ? 'text-text-primary' : 'text-text-secondary/50',
						)}
					>
						{display}
					</p>
				</div>
				<Icon
					name="ArrowDown"
					className={cn(
						'size-5 text-text-secondary/50 transition-transform group-focus-within:text-text-secondary',
						open && 'rotate-180',
					)}
				/>
			</button>

			{open && (
				<div
					ref={popRef}
					role="listbox"
					tabIndex={-1}
					className={cn(
						'absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-accent-10 bg-accent shadow-md',
					)}
				>
					<ul className="max-h-56 overflow-auto p-2">
						{options.map((o) => {
							const active = o.value === selectedValue;
							return (
								<li key={o.value}>
									<button
										type="button"
										role="option"
										tabIndex={0}
										aria-selected={o.value === selectedValue}
										onClick={() => {
											if (isControlled) {
												onChange?.(o.value);
											} else {
												setInternalValue(o.value);
												onChange?.(o.value);
											}
											setOpen(false);
											btnRef.current?.focus();
										}}
										className={cn(
											'flex w-full items-center justify-between rounded-md px-3 py-2 text-left outline-none transition-colors',
											active
												? 'bg-primary text-white'
												: 'text-text-secondary hover:bg-accent-10',
										)}
									>
										{o.label}
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			)}

			{/* helper text */}
			{helperText ? (
				<span className="px-3 text-sm text-text-secondary/70 group-has-[:invalid]:hidden group-has-[[aria-invalid=true]]:hidden">
					{helperText}
				</span>
			) : null}

			{/* error text */}
			{errorText ? (
				<span className="hidden px-3 text-danger/70 text-sm group-has-[:invalid]:block group-has-[[aria-invalid=true]]:block">
					{errorText}
				</span>
			) : null}
		</div>
	);
};
