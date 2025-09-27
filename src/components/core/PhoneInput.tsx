import { InputProps, Select, SelectItem } from '@heroui/react';
import { useCallback, useMemo } from 'react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { Input } from '@/components/core/Input';
import { cn } from '@/lib/utils';

type HeroInputProps = Omit<InputProps, 'onChange' | 'value' | 'ref'>;
type RPNInputProps = Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'>;

type Props = HeroInputProps &
	RPNInputProps & {
		onChange?: (value: RPNInput.Value) => void;
		ref?: React.Ref<HTMLInputElement>;
	};

export const PhoneInput = ({
	className,
	onChange,
	value,
	ref,
	...props
}: Props) => {
	const errorMsg =
		typeof props.errorMessage === 'function' ? null : props.errorMessage;

	const handleChange = useCallback(
		(v: RPNInput.Value) => {
			const phoneValue = v || '';
			onChange?.(phoneValue as RPNInput.Value);
		},
		[onChange],
	);

	return (
		<div className={cn('flex flex-col', className)}>
			<RPNInput.default
				className="flex w-full"
				smartCaret={false}
				value={value || undefined}
				onChange={handleChange}
				flagComponent={useMemo(
					() => (fp: RPNInput.FlagProps) => {
						const Flag = flags[fp.country];
						return (
							<span className="flex h-5 w-7 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
								{Flag && <Flag title={fp.countryName} />}
							</span>
						);
					},
					[],
				)}
				inputComponent={useMemo(
					() => (ip: any) => (
						<Input
							{...ip}
							classNames={{
								label: cn(
									'text-foreground/50',
									'group-data-[disabled=true]:!text-foreground/30',
								),
								inputWrapper: cn(
									'h-14 rounded-l-none',
									'group-data-[invalid=true]:!border-r-2',
									'group-data-[invalid=true]:!border-t-2',
									'group-data-[invalid=true]:!border-b-2',
									'group-data-[invalid=true]:!border-danger',
									'group-data-[invalid=true]:!bg-danger/5',
								),
							}}
							isInvalid={ip.isInvalid}
							errorMessage={null}
						/>
					),
					[],
				)}
				countrySelectComponent={useCallback(
					(sp: any) => {
						const selectedKeys = sp.value
							? new Set([sp.value])
							: new Set<string>();
						return (
							<Select
								aria-label="Country"
								selectedKeys={selectedKeys}
								isDisabled={sp.disabled}
								errorMessage={null}
								isInvalid={props.isInvalid}
								onSelectionChange={(keys) => {
									const key = Array.from(keys)[0] as string | undefined;
									if (key) sp.onChange(key as RPNInput.Country);
								}}
								className="w-20 min-w-20"
								size="md"
								classNames={{
									trigger: cn(
										'h-14 rounded-r-none',
										'group-data-[invalid=true]:!border-l-2',
										'group-data-[invalid=true]:!border-t-2',
										'group-data-[invalid=true]:!border-b-2',
										'group-data-[invalid=true]:!border-danger',
										'group-data-[invalid=true]:!bg-danger/5',
									),
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
										(o: {
											label: string;
											value: RPNInput.Country | undefined;
										}) => o.value === key,
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
					},
					[props.isInvalid],
				)}
				{...props}
			/>
			{errorMsg && <p className="p-1 text-danger text-tiny">{errorMsg}</p>}
		</div>
	);
};
