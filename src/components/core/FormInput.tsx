import type { ComponentProps } from 'react';
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
	type RegisterOptions,
} from 'react-hook-form';
import { Input } from './Input';
import { Stack } from './Stack';
import { Text } from './Text';

interface FormInputProps<TFieldValues extends FieldValues = FieldValues>
	extends Omit<ComponentProps<typeof Input>, 'name'> {
	name: Path<TFieldValues>;
	control: Control<TFieldValues>;
	label?: string;
	rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
	className?: string;
	input?: ComponentProps<typeof Input>;
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
			render={({ field, fieldState: { error } }) => {
				return (
					<Stack className={className}>
						{label && (
							<label
								htmlFor={name}
								className="mb-1 ml-2 text-base tracking-wider"
							>
								{label}
							</label>
						)}

						<Input id={name} {...field} {...input} />

						{error && (
							<Text size="sm" weight="light" className="mt-1 ml-2 text-red-500">
								{error.message}
							</Text>
						)}
					</Stack>
				);
			}}
		/>
	);
}
