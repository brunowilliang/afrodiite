'use client';

import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { escortProfileSchema } from '@/api/utils/schemas/escort-forms';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { Stack } from '@/components/core/Stack';
import { useProfile } from '@/hooks/useProfile';
import { Badge } from '../../components/Badge';

const formSchema = escortProfileSchema.pick({
	characteristics: true,
});

export const Caracteristicas = () => {
	const { profile, updateProfile, isUpdating } = useProfile();

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

	const form = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onChange',
		defaultValues: {
			characteristics: {
				gender: profile?.characteristics?.gender ?? '',
				age: Number(profile?.characteristics?.age) || 18,
				height: Number(profile?.characteristics?.height) || 1.54,
				weight: Number(profile?.characteristics?.weight) || 54.4,
				eye_color: profile?.characteristics?.eye_color ?? '',
				hair_color: profile?.characteristics?.hair_color ?? '',
				ethnicity: profile?.characteristics?.ethnicity ?? '',
				languages: profile?.characteristics?.languages ?? '',
				sexual_preference: profile?.characteristics?.sexual_preference ?? '',
				silicone: Boolean(profile?.characteristics?.silicone),
				tattoos: Boolean(profile?.characteristics?.tattoos),
				piercings: Boolean(profile?.characteristics?.piercings),
				smoker: Boolean(profile?.characteristics?.smoker),
			},
		},
	});

	return (
		<Stack className="gap-5">
			<Badge icon="Diamond" label="Características" />
			<Form
				validationBehavior="aria"
				onSubmit={form.handleSubmit((data) => updateProfile(data))}
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
								defaultValue={18}
								maxValue={100}
								step={1}
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
								defaultValue={1.54}
								step={0.01}
								formatOptions={{
									style: 'decimal',
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
									useGrouping: false,
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
								minValue={30}
								defaultValue={54.4}
								maxValue={200}
								step={0.1}
								formatOptions={{
									style: 'decimal',
									minimumFractionDigits: 1,
									maximumFractionDigits: 1,
									useGrouping: false,
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
								<Input.Select.Item key="Masculino">Masculino</Input.Select.Item>
								<Input.Select.Item key="Feminino">Feminino</Input.Select.Item>
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
								<Input.Select.Item key="Branca">Branca</Input.Select.Item>
								<Input.Select.Item key="Negra">Negra</Input.Select.Item>
								<Input.Select.Item key="Parda">Parda</Input.Select.Item>
								<Input.Select.Item key="Indígena">Indígena</Input.Select.Item>
								<Input.Select.Item key="Caucasiana">
									Caucasiana
								</Input.Select.Item>
								<Input.Select.Item key="Asiática">Asiática</Input.Select.Item>
								<Input.Select.Item key="Latina">Latina</Input.Select.Item>
								<Input.Select.Item key="Mestiça">Mestiça</Input.Select.Item>
								<Input.Select.Item key="Outra">Outra</Input.Select.Item>
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
								<Input.Select.Item key="Castanhos escuros">
									Castanhos escuros
								</Input.Select.Item>
								<Input.Select.Item key="Castanhos claros">
									Castanhos claros
								</Input.Select.Item>
								<Input.Select.Item key="Castanhos">Castanhos</Input.Select.Item>
								<Input.Select.Item key="Pretos">Pretos</Input.Select.Item>
								<Input.Select.Item key="Azuis escuros">
									Azuis escuros
								</Input.Select.Item>
								<Input.Select.Item key="Azuis claros">
									Azuis claros
								</Input.Select.Item>
								<Input.Select.Item key="Verdes escuros">
									Verdes escuros
								</Input.Select.Item>
								<Input.Select.Item key="Verdes claros">
									Verdes claros
								</Input.Select.Item>
								<Input.Select.Item key="Mel">Mel</Input.Select.Item>
								<Input.Select.Item key="Avelã">Avelã</Input.Select.Item>
								<Input.Select.Item key="Cinzentos">Cinzentos</Input.Select.Item>
								<Input.Select.Item key="Violetas">Violetas</Input.Select.Item>
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
								<Input.Select.Item key="Preto">Preto</Input.Select.Item>
								<Input.Select.Item key="Castanho escuro">
									Castanho escuro
								</Input.Select.Item>
								<Input.Select.Item key="Castanho claro">
									Castanho claro
								</Input.Select.Item>
								<Input.Select.Item key="Castanho">Castanho</Input.Select.Item>
								<Input.Select.Item key="Moreno">Moreno</Input.Select.Item>
								<Input.Select.Item key="Loiro platinado">
									Loiro platinado
								</Input.Select.Item>
								<Input.Select.Item key="Loiro escuro">
									Loiro escuro
								</Input.Select.Item>
								<Input.Select.Item key="Loiro claro">
									Loiro claro
								</Input.Select.Item>
								<Input.Select.Item key="Loiro">Loiro</Input.Select.Item>
								<Input.Select.Item key="Ruivo claro">
									Ruivo claro
								</Input.Select.Item>
								<Input.Select.Item key="Ruivo escuro">
									Ruivo escuro
								</Input.Select.Item>
								<Input.Select.Item key="Ruivo">Ruivo</Input.Select.Item>
								<Input.Select.Item key="Auburn">Auburn</Input.Select.Item>
								<Input.Select.Item key="Grisalho">Grisalho</Input.Select.Item>
								<Input.Select.Item key="Branco">Branco</Input.Select.Item>
								<Input.Select.Item key="Colorido">Colorido</Input.Select.Item>
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
									<Input.Select.Item key={language}>
										{language}
									</Input.Select.Item>
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
								<Input.Select.Item key="Homens">Homens</Input.Select.Item>
								<Input.Select.Item key="Mulheres">Mulheres</Input.Select.Item>
								<Input.Select.Item key="Ambos os sexos">
									Ambos os sexos
								</Input.Select.Item>
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

				<Button size="md" type="submit" isLoading={isUpdating}>
					Salvar
				</Button>
			</Form>
		</Stack>
	);
};
