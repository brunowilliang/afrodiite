import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
import { api } from '@/lib/api';
import { characteristicsSchema } from './schema';

const schema = characteristicsSchema;

type CharacteristicsTabProps = { onClose?: () => void };

export const CharacteristicsTab = ({ onClose }: CharacteristicsTabProps) => {
	const router = useRouter();
	const { session, profile } = useRouteContext({ from: '/{-$locale}' });

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	const handleSubmit = (values: z.infer<typeof schema>) => {
		console.log(values);
		updateProfile.mutateAsync(
			{
				id: session?.user.id,
				characteristics: {
					...values,
				},
			},
			{
				onSuccess: () => {
					toast.success('Profile updated');
					router.invalidate();
					onClose?.();
				},
				onError: (error) => {
					console.error(error);
					toast.error('Error updating profile', {
						description: error.message,
					});
				},
			},
		);
	};

	const form = useForm({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: {
			gender: profile?.characteristics?.gender ?? '',
			age: profile?.characteristics?.age ?? 18,
			height: profile?.characteristics?.height ?? 0,
			weight: profile?.characteristics?.weight ?? 0,
			eye_color: profile?.characteristics?.eye_color ?? '',
			hair_color: profile?.characteristics?.hair_color ?? '',
			ethnicity: profile?.characteristics?.ethnicity ?? '',
			languages: profile?.characteristics?.languages ?? '',
			sexual_preference: profile?.characteristics?.sexual_preference ?? '',
			silicone: profile?.characteristics?.silicone ?? false,
			tattoos: profile?.characteristics?.tattoos ?? false,
			piercings: profile?.characteristics?.piercings ?? false,
			smoker: profile?.characteristics?.smoker ?? false,
		},
	});

	return (
		<Form
			validationBehavior="aria"
			onSubmit={form.handleSubmit(handleSubmit)}
			className="w-full space-y-3"
		>
			<Controller
				control={form.control}
				name="gender"
				render={({ field, fieldState }) => (
					<Input.Select
						isRequired
						label="Gênero"
						value={field.value}
						onChange={field.onChange}
						selectedKeys={[field.value]}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						<Input.Select.Item key="male">Masculino</Input.Select.Item>
						<Input.Select.Item key="female">Feminino</Input.Select.Item>
					</Input.Select>
				)}
			/>

			<Controller
				control={form.control}
				name="age"
				render={({ field, fieldState }) => (
					<Input.Number
						isRequired
						label="Idade"
						minValue={18}
						maxValue={100}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
						value={field.value as number}
						onValueChange={field.onChange}
						onBlur={field.onBlur}
					/>
				)}
			/>
			<Controller
				control={form.control}
				name="height"
				render={({ field, fieldState }) => (
					<Input.Number
						isRequired
						label="Altura"
						minValue={80}
						maxValue={250}
						step={1}
						formatOptions={{
							style: 'unit',
							unit: 'centimeter',
							unitDisplay: 'short',
							minimumFractionDigits: 0,
							maximumFractionDigits: 0,
						}}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
						value={field.value as number}
						onValueChange={field.onChange}
						onBlur={field.onBlur}
					/>
				)}
			/>
			<Controller
				control={form.control}
				name="weight"
				render={({ field, fieldState }) => (
					<Input.Number
						isRequired
						label="Peso"
						maxValue={250}
						formatOptions={{
							style: 'unit',
							unit: 'kilogram',
							unitDisplay: 'short',
							minimumFractionDigits: 1,
							maximumFractionDigits: 2,
						}}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
						value={field.value as number}
						onValueChange={field.onChange}
						onBlur={field.onBlur}
					/>
				)}
			/>

			<Controller
				control={form.control}
				name="eye_color"
				render={({ field, fieldState }) => (
					<Input
						isRequired
						label="Cor dos olhos"
						{...field}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					/>
				)}
			/>

			<Controller
				control={form.control}
				name="hair_color"
				render={({ field, fieldState }) => (
					<Input
						isRequired
						label="Cor do cabelo"
						{...field}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					/>
				)}
			/>

			<Controller
				control={form.control}
				name="ethnicity"
				render={({ field, fieldState }) => (
					<Input.Select
						isRequired
						label="Etnia"
						value={field.value}
						onChange={field.onChange}
						selectedKeys={[field.value]}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						<Input.Select.Item key="white">Branco</Input.Select.Item>
						<Input.Select.Item key="black">Negro</Input.Select.Item>
						<Input.Select.Item key="brown">Pardo</Input.Select.Item>
						<Input.Select.Item key="indigenous">Indígena</Input.Select.Item>
						<Input.Select.Item key="other">Outro</Input.Select.Item>
					</Input.Select>
				)}
			/>

			<Controller
				control={form.control}
				name="languages"
				render={({ field, fieldState }) => (
					<Input
						isRequired
						label="Idiomas"
						{...field}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					/>
				)}
			/>

			<Controller
				control={form.control}
				name="sexual_preference"
				render={({ field, fieldState }) => (
					<Input.Select
						isRequired
						label="Preferência sexual"
						value={field.value}
						onChange={field.onChange}
						selectedKeys={[field.value]}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						<Input.Select.Item key="male">Masculino</Input.Select.Item>
						<Input.Select.Item key="female">Feminino</Input.Select.Item>
						<Input.Select.Item key="both">Ambos</Input.Select.Item>
					</Input.Select>
				)}
			/>

			<Controller
				control={form.control}
				name="silicone"
				render={({ field, fieldState }) => (
					<Input.Select
						isRequired
						label="Tem silicone?"
						selectedKeys={[field.value ? 'true' : 'false']}
						onChange={(v) => {
							const val = typeof v === 'string' ? v : (v as any)?.target?.value;
							field.onChange(val === 'true');
						}}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						<Input.Select.Item key="true">Sim</Input.Select.Item>
						<Input.Select.Item key="false">Não</Input.Select.Item>
					</Input.Select>
				)}
			/>

			<Controller
				control={form.control}
				name="tattoos"
				render={({ field, fieldState }) => (
					<Input.Select
						isRequired
						label="Tem tatuagens?"
						selectedKeys={[field.value ? 'true' : 'false']}
						onChange={(v) => {
							const val = typeof v === 'string' ? v : (v as any)?.target?.value;
							field.onChange(val === 'true');
						}}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						<Input.Select.Item key="true">Sim</Input.Select.Item>
						<Input.Select.Item key="false">Não</Input.Select.Item>
					</Input.Select>
				)}
			/>

			<Controller
				control={form.control}
				name="piercings"
				render={({ field, fieldState }) => (
					<Input.Select
						isRequired
						label="Tem piercing?"
						selectedKeys={[field.value ? 'true' : 'false']}
						onChange={(v) => {
							const val = typeof v === 'string' ? v : (v as any)?.target?.value;
							field.onChange(val === 'true');
						}}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						<Input.Select.Item key="true">Sim</Input.Select.Item>
						<Input.Select.Item key="false">Não</Input.Select.Item>
					</Input.Select>
				)}
			/>

			<Controller
				control={form.control}
				name="smoker"
				render={({ field, fieldState }) => (
					<Input.Select
						isRequired
						label="Fumante?"
						selectedKeys={[field.value ? 'true' : 'false']}
						onChange={(v) => {
							const val = typeof v === 'string' ? v : (v as any)?.target?.value;
							field.onChange(val === 'true');
						}}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						<Input.Select.Item key="true">Sim</Input.Select.Item>
						<Input.Select.Item key="false">Não</Input.Select.Item>
					</Input.Select>
				)}
			/>

			<Button type="submit" isLoading={updateProfile.isPending}>
				Salvar
			</Button>
		</Form>
	);
};
