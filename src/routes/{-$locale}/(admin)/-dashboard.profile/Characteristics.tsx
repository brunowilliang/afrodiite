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

	const languageOptions = [
		'Português',
		'Inglês',
		'Espanhol',
		'Francês',
		'Italiano',
		'Alemão',
		'Russo',
		'Árabe',
		'Chinês',
		'Japonês',
		'Coreano',
		'Holandês',
		'Sueco',
		'Norueguês',
		'Dinamarquês',
		'Polonês',
		'Turco',
		'Hebraico',
		'Hindi',
		'Tailandês',
		'Vietnamita',
		'Tcheco',
		'Húngaro',
		'Romeno',
		'Catalão',
		'Grego',
		'Búlgaro',
		'Croata',
		'Finlandês',
		'Ucraniano',
	].sort();

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	const handleSubmit = (values: z.infer<typeof schema>) => {
		console.log(values);
		updateProfile.mutateAsync(
			{
				id: session?.user.id,
				characteristics: values.characteristics,
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
		resolver: zodResolver(schema) as any,
		mode: 'onChange',
		defaultValues: {
			characteristics: {
				gender: profile?.characteristics?.gender ?? '',
				age: profile?.characteristics?.age ?? 18,
				height: profile?.characteristics?.height ?? 1.54,
				weight: profile?.characteristics?.weight ?? 54.4,
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
		},
	});

	return (
		<Form
			validationBehavior="aria"
			onSubmit={form.handleSubmit(handleSubmit)}
			className="flex w-full flex-col gap-3"
		>
			<div className="flex w-full flex-col gap-3 sm:flex-row">
				<Controller
					control={form.control}
					name="characteristics.age"
					render={({ field, fieldState }) => (
						<Input.Number
							isRequired
							label="Idade"
							description="Ex: 25"
							minValue={17}
							maxValue={100}
							step={1}
							formatOptions={{
								style: 'unit',
								unit: 'year',
								unitDisplay: 'long',
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
					name="characteristics.height"
					render={({ field, fieldState }) => (
						<Input.Number
							isRequired
							label="Altura"
							description="Ex: 1,54"
							step={0.01}
							formatOptions={{
								style: 'unit',
								unit: 'meter',
								unitDisplay: 'short',
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							}}
							isInvalid={!!fieldState.error}
							errorMessage={fieldState.error?.message}
							value={field.value as number}
							onValueChange={(value) => {
								if (!value) {
									field.onChange(1.7);
									return;
								}

								// Se digitou um número como 184, converte automaticamente para 1.84
								if (value >= 100) {
									const converted = value / 100;
									field.onChange(Math.max(1.0, Math.min(2.5, converted)));
								} else {
									// Se já está em formato correto (1.84), mantém
									field.onChange(Math.max(1.0, Math.min(2.5, value)));
								}
							}}
							onBlur={field.onBlur}
						/>
					)}
				/>
				<Controller
					control={form.control}
					name="characteristics.weight"
					render={({ field, fieldState }) => (
						<Input.Number
							isRequired
							label="Peso"
							description="Ex: 54,4"
							minValue={25}
							maxValue={200}
							step={0.1}
							formatOptions={{
								style: 'unit',
								unit: 'kilogram',
								unitDisplay: 'short',
								minimumFractionDigits: 1,
								maximumFractionDigits: 1,
							}}
							isInvalid={!!fieldState.error}
							errorMessage={fieldState.error?.message}
							value={field.value as number}
							onValueChange={field.onChange}
							onBlur={field.onBlur}
						/>
					)}
				/>
			</div>

			<div className="flex w-full flex-col gap-3 sm:flex-row">
				<Controller
					control={form.control}
					name="characteristics.gender"
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
					name="characteristics.ethnicity"
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
			</div>

			<div className="flex w-full flex-col gap-3 sm:flex-row">
				<Controller
					control={form.control}
					name="characteristics.eye_color"
					render={({ field, fieldState }) => (
						<Input.Select
							isRequired
							label="Cor dos olhos"
							value={field.value}
							onChange={field.onChange}
							selectedKeys={[field.value]}
							onBlur={field.onBlur}
							isInvalid={!!fieldState.error}
							errorMessage={fieldState.error?.message}
						>
							<Input.Select.Item key="castanho-escuro">
								Castanho escuro
							</Input.Select.Item>
							<Input.Select.Item key="castanho-claro">
								Castanho claro
							</Input.Select.Item>
							<Input.Select.Item key="preto">Preto</Input.Select.Item>
							<Input.Select.Item key="azul-escuro">
								Azul escuro
							</Input.Select.Item>
							<Input.Select.Item key="azul-claro">Azul claro</Input.Select.Item>
							<Input.Select.Item key="verde-escuro">
								Verde escuro
							</Input.Select.Item>
							<Input.Select.Item key="verde-claro">
								Verde claro
							</Input.Select.Item>
							<Input.Select.Item key="mel">Mel/Âmbar</Input.Select.Item>
							<Input.Select.Item key="avela">Avelã</Input.Select.Item>
							<Input.Select.Item key="cinza">Cinza</Input.Select.Item>
							<Input.Select.Item key="violeta">Violeta</Input.Select.Item>
						</Input.Select>
					)}
				/>

				<Controller
					control={form.control}
					name="characteristics.hair_color"
					render={({ field, fieldState }) => (
						<Input.Select
							isRequired
							label="Cor do cabelo"
							value={field.value}
							onChange={field.onChange}
							selectedKeys={[field.value]}
							onBlur={field.onBlur}
							isInvalid={!!fieldState.error}
							errorMessage={fieldState.error?.message}
						>
							<Input.Select.Item key="preto">Preto</Input.Select.Item>
							<Input.Select.Item key="castanho-escuro">
								Castanho escuro
							</Input.Select.Item>
							<Input.Select.Item key="castanho-claro">
								Castanho claro
							</Input.Select.Item>
							<Input.Select.Item key="loiro-platinado">
								Loiro platinado
							</Input.Select.Item>
							<Input.Select.Item key="loiro-escuro">
								Loiro escuro
							</Input.Select.Item>
							<Input.Select.Item key="loiro-claro">
								Loiro claro
							</Input.Select.Item>
							<Input.Select.Item key="ruivo-claro">
								Ruivo claro
							</Input.Select.Item>
							<Input.Select.Item key="ruivo-escuro">
								Ruivo escuro
							</Input.Select.Item>
							<Input.Select.Item key="auburn">Auburn</Input.Select.Item>
							<Input.Select.Item key="grisalho">Grisalho</Input.Select.Item>
							<Input.Select.Item key="branco">Branco</Input.Select.Item>
							<Input.Select.Item key="colorido">Colorido</Input.Select.Item>
						</Input.Select>
					)}
				/>
			</div>

			<div className="flex w-full flex-col gap-3 sm:flex-row">
				<Controller
					control={form.control}
					name="characteristics.languages"
					render={({ field, fieldState }) => (
						<Input.Select
							isRequired
							autoComplete="on"
							label="Idiomas"
							selectionMode="multiple"
							value={field.value}
							isClearable
							selectedKeys={
								field.value
									? field.value.split(', ').map((lang) => lang.trim())
									: []
							}
							onSelectionChange={(keys) => {
								// Converte Set para array de nomes de idiomas
								const selectedArray = Array.from(keys as Set<string>);
								const selectedLanguages = selectedArray.join(', ');
								field.onChange(selectedLanguages);
							}}
							onBlur={field.onBlur}
							isInvalid={!!fieldState.error}
							errorMessage={fieldState.error?.message}
						>
							{languageOptions.map((language) => (
								<Input.Select.Item key={language}>{language}</Input.Select.Item>
							))}
						</Input.Select>
					)}
				/>
				<Controller
					control={form.control}
					name="characteristics.sexual_preference"
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
			</div>
			<div className="flex w-full flex-col gap-3 sm:flex-row">
				<Controller
					control={form.control}
					name="characteristics.silicone"
					render={({ field, fieldState }) => (
						<Input.Select
							isRequired
							label="Tem silicone?"
							selectedKeys={[field.value ? 'true' : 'false']}
							onChange={(v) => {
								const val =
									typeof v === 'string' ? v : (v as any)?.target?.value;
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
					name="characteristics.tattoos"
					render={({ field, fieldState }) => (
						<Input.Select
							isRequired
							label="Tem tatuagens?"
							selectedKeys={[field.value ? 'true' : 'false']}
							onChange={(v) => {
								const val =
									typeof v === 'string' ? v : (v as any)?.target?.value;
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
			</div>
			<div className="flex w-full flex-col gap-3 sm:flex-row">
				<Controller
					control={form.control}
					name="characteristics.piercings"
					render={({ field, fieldState }) => (
						<Input.Select
							isRequired
							label="Tem piercing?"
							selectedKeys={[field.value ? 'true' : 'false']}
							onChange={(v) => {
								const val =
									typeof v === 'string' ? v : (v as any)?.target?.value;
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
					name="characteristics.smoker"
					render={({ field, fieldState }) => (
						<Input.Select
							isRequired
							label="Fumante?"
							selectedKeys={[field.value ? 'true' : 'false']}
							onChange={(v) => {
								const val =
									typeof v === 'string' ? v : (v as any)?.target?.value;
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
			</div>

			<Button type="submit" isLoading={updateProfile.isPending}>
				Salvar
			</Button>
		</Form>
	);
};
