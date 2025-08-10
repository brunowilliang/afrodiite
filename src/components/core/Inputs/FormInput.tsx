import type { ComponentProps } from 'react';
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
	type RegisterOptions,
} from 'react-hook-form';
import { Select } from '../Inputs/Select';
import { Checkbox } from './Checkbox';
import { Input } from './Input';
import { TextArea } from './TextArea';

interface FormInputProps<TFieldValues extends FieldValues = FieldValues>
	extends Omit<ComponentProps<typeof Input>, 'name'> {
	name: Path<TFieldValues>;
	control: Control<TFieldValues>;
	label?: string;
	rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
	className?: string;
	input?: ComponentProps<typeof Input>;
	// Extra props when using type='select'
	options?: Array<{ value: string; label: string }>;
}

export function FormInput<TFieldValues extends FieldValues = FieldValues>({
	name,
	control,
	label,
	rules,
	className,
	...input
}: FormInputProps<TFieldValues>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			defaultValue={
				// Allow override; for selects, start as undefined for required validation
				(input as any)?.defaultValue !== undefined
					? (input as any).defaultValue
					: (input as any)?.type === 'select'
						? (undefined as any)
						: ('' as any)
			}
			render={({ field, fieldState: { error } }) => {
				const { value, onChange, onBlur, name: fieldName, ref } = field;
				const { type, inputClassName, ...restInput } = input as any;

				if (type === 'checkbox') {
					return (
						<Checkbox
							id={fieldName}
							ref={ref}
							checked={Boolean(value)}
							onChange={onChange}
							onCheckedChange={onChange}
							onBlur={onBlur}
							className={className}
							aria-invalid={Boolean(error)}
							{...restInput}
						/>
					);
				}

				if (type === 'text-area') {
					return (
						<TextArea
							id={fieldName}
							ref={ref as any}
							value={(value as unknown as string) ?? ''}
							onChange={onChange as any}
							onBlur={onBlur}
							label={label}
							className={className}
							textareaClassName={inputClassName}
							errorText={error?.message}
							aria-invalid={Boolean(error)}
							{...(restInput as any)}
						/>
					);
				}

				if (type === 'select') {
					// Expect options & placeholder in restInput
					const currentValue = (value as unknown as string) ?? '';
					return (
						<Select
							id={fieldName}
							value={currentValue || undefined}
							onChange={(v) => onChange(v)}
							onBlur={onBlur as any}
							label={label}
							className={className}
							aria-invalid={Boolean(error)}
							errorText={error?.message}
							{...(restInput as any)}
						/>
					);
				}

				return (
					<Input
						id={fieldName}
						ref={ref}
						value={(value as unknown as string) ?? ''}
						onChange={onChange}
						onBlur={onBlur}
						type={type}
						label={label}
						className={className}
						inputClassName={inputClassName}
						errorText={error?.message}
						aria-invalid={Boolean(error)}
						{...restInput}
					/>
				);
			}}
		/>
	);
}
