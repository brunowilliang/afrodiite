import { Input, Select, SelectItem } from '@heroui/react';
import * as React from 'react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { cn } from '@/lib/utils';

type PhoneInputProps = Omit<
	React.ComponentProps<'input'>,
	'onChange' | 'value' | 'ref'
> &
	Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
		onChange?: (value: RPNInput.Value) => void;
		label?: React.ReactNode;
	};

const PhoneInput = ({
	className,
	onChange,
	value,
	...props
}: PhoneInputProps) => {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [_, setContainerWidth] = React.useState<number>(0);
	const [inputHeight, setInputHeight] = React.useState<number>(0);

	React.useLayoutEffect(() => {
		const compute = () => {
			const el = containerRef.current;
			if (!el) return;
			setContainerWidth(el.getBoundingClientRect().width);
			const inputEl = el.querySelector('input') as HTMLInputElement | null;
			const h =
				(inputEl?.parentElement as HTMLElement | undefined)?.offsetHeight ||
				inputEl?.offsetHeight ||
				0;
			if (h) setInputHeight(h);
		};
		compute();
		const ro = new ResizeObserver(() => compute());
		if (containerRef.current) ro.observe(containerRef.current);
		window.addEventListener('resize', compute);
		const id = window.setTimeout(compute, 0);
		return () => {
			window.removeEventListener('resize', compute);
			window.clearTimeout(id);
			ro.disconnect();
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn('flex', className)}
			style={{ ['--pih' as any]: inputHeight ? `${inputHeight}px` : undefined }}
		>
			<RPNInput.default
				className="flex w-full"
				smartCaret={false}
				value={value || undefined}
				onChange={(v) => onChange?.(v || ('' as RPNInput.Value))}
				flagComponent={(fp: RPNInput.FlagProps) => {
					const Flag = flags[fp.country];
					return (
						<span className="flex h-5 w-7 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
							{Flag && <Flag title={fp.countryName} />}
						</span>
					);
				}}
				inputComponent={(ip: React.ComponentProps<typeof Input>) => (
					<Input
						size="lg"
						classNames={{ inputWrapper: 'rounded-l-none' }}
						label={props.label}
						placeholder={props.placeholder ?? ip.placeholder}
						{...ip}
					/>
				)}
				countrySelectComponent={(sp) => {
					const selectedKeys = sp.value
						? new Set([sp.value])
						: new Set<string>();
					return (
						<Select
							aria-label="Country"
							isDisabled={sp.disabled}
							selectedKeys={selectedKeys}
							onSelectionChange={(keys) => {
								const key = Array.from(keys)[0] as string | undefined;
								if (key) sp.onChange(key as RPNInput.Country);
							}}
							className="w-20 min-w-20"
							size="lg"
							classNames={{
								trigger: 'rounded-r-none  h-16',
							}}
							popoverProps={{
								classNames: {
									content: 'w-80',
								},
								placement: 'bottom-start',
							}}
							renderValue={(items) => {
								const key = (items?.[0]?.key as RPNInput.Country) ?? sp.value;
								const match = sp.options.find(
									(o: { label: string; value: RPNInput.Country | undefined }) =>
										o.value === key,
								);
								const label = match?.label ?? key;
								const F = key ? flags[key as keyof typeof flags] : undefined;
								return (
									<div className="flex items-center">
										<span className="flex h-5 w-7 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
											{F ? <F title={label} /> : ''}
										</span>
									</div>
								);
							}}
						>
							{sp.options.map(
								({
									value,
									label,
								}: {
									value: RPNInput.Country;
									label: string;
								}) => (
									<SelectItem
										key={value}
										startContent={(() => {
											const F = flags[value as keyof typeof flags];
											return (
												<span className="flex h-5 w-7 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
													{F && <F title={label} />}
												</span>
											);
										})()}
									>
										{label}
									</SelectItem>
								),
							)}
						</Select>
					);
				}}
				{...props}
			/>
		</div>
	);
};

export { PhoneInput };
