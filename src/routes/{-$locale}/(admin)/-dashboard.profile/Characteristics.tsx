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

const schema = z.object({
	gender: z.string().min(1, { error: 'Gênero é obrigatório' }),
	age: z.coerce
		.number({
			error: 'Idade deve ser um número',
		})
		.min(18, { error: 'Idade mínima é 18 anos' })
		.max(100, { error: 'Idade máxima é 100 anos' }),
	height: z.coerce
		.number({
			error: 'Altura deve ser um número',
		})
		.min(1, { error: 'Altura é obrigatória' })
		.max(250, { error: 'Altura máxima é 250cm' }),
	weight: z.coerce
		.number({
			error: 'Peso deve ser um número',
		})
		.min(1, { error: 'Peso é obrigatório' }),
	eye_color: z.string().min(1, { error: 'Cor dos olhos é obrigatória' }),
	hair_color: z.string().min(1, { error: 'Cor do cabelo é obrigatória' }),
	ethnicity: z.string().min(1, { error: 'Etnia é obrigatória' }),
	languages: z.string().min(1, { error: 'Idioma é obrigatório' }),
	sexual_preference: z
		.string()
		.min(1, { error: 'Preferência sexual é obrigatória' }),
	silicone: z.enum(['yes', 'no'], {
		error: 'Silicone é obrigatório',
	}),
	tattoos: z.enum(['yes', 'no'], {
		error: 'Tatuagens é obrigatório',
	}),
	piercings: z.enum(['yes', 'no'], {
		error: 'Piercings é obrigatório',
	}),
	smoker: z.enum(['yes', 'no'], { error: 'Fumante é obrigatório' }),
});

export const CharacteristicsTab = () => {
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
			silicone: profile?.characteristics?.silicone ?? 'no',
			tattoos: profile?.characteristics?.tattoos ?? 'no',
			piercings: profile?.characteristics?.piercings ?? 'no',
			smoker: profile?.characteristics?.smoker ?? 'no',
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
						value={field.value}
						onChange={field.onChange}
						selectedKeys={[field.value]}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						<Input.Select.Item key="yes">Sim</Input.Select.Item>
						<Input.Select.Item key="no">Não</Input.Select.Item>
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
						value={field.value}
						onChange={field.onChange}
						selectedKeys={[field.value]}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						<Input.Select.Item key="yes">Sim</Input.Select.Item>
						<Input.Select.Item key="no">Não</Input.Select.Item>
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
						value={field.value}
						onChange={field.onChange}
						selectedKeys={[field.value]}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						<Input.Select.Item key="yes">Sim</Input.Select.Item>
						<Input.Select.Item key="no">Não</Input.Select.Item>
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
						value={field.value}
						onChange={field.onChange}
						selectedKeys={[field.value]}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						<Input.Select.Item key="yes">Sim</Input.Select.Item>
						<Input.Select.Item key="no">Não</Input.Select.Item>
					</Input.Select>
				)}
			/>

			<Button type="submit" isLoading={updateProfile.isPending}>
				Salvar
			</Button>
		</Form>
	);
};
