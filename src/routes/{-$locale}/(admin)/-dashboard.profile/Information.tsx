import { useForm } from 'react-hook-form';
import slugify from 'slugify';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { FormInput } from '@/components/core/Inputs/FormInput';
import { Stack } from '@/components/core/Stack';
import type { profile } from '@/queries/profile';
import type { EscortProfile } from '@/schemas/forms/profile';

interface Props {
	id: string;
	data?: Partial<EscortProfile['information']>;
	onSubmit: ReturnType<typeof profile.update.useMutation>;
}

export const InformationTab = ({ id, data, onSubmit }: Props) => {
	const form = useForm({
		mode: 'onChange',
		values: data ?? {},
	});

	const handleSubmit = async (values: typeof data) => {
		await onSubmit.mutateAsync({
			id,
			...values,
		});
	};

	return (
		<Stack className="gap-5">
			<Badge>
				<Badge.Text>Informações</Badge.Text>
			</Badge>

			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Stack className="gap-4">
					<FormInput
						control={form.control}
						name="artist_name"
						label="Nome Artístico"
						type="text"
						placeholder="Digite seu nome artístico"
						onBlur={(e) => {
							if (!form.formState.dirtyFields.slug) {
								form.setValue(
									'slug',
									slugify(e.target.value ?? '', {
										lower: true,
									}),
									{ shouldValidate: true },
								);
							}
						}}
						rules={{
							required: {
								value: true,
								message: 'Nome artístico é obrigatório',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="slug"
						label="URL Personalizada (Slug)"
						type="text"
						placeholder=""
						onKeyDown={(e) => {
							if (e.key === ' ') {
								e.preventDefault();
								const cur = form.getValues('slug') ?? '';
								const next = (cur + '-').replace(/--+/g, '-');
								form.setValue('slug', next, {
									shouldDirty: true,
									shouldValidate: true,
								});
							}
						}}
						onChange={(e) => {
							const raw = (e.target.value ?? '').replace(/\s+/g, '-');
							const next = slugify(raw, {
								lower: true,
								strict: true,
								trim: true,
							});
							form.setValue('slug', next, {
								shouldDirty: true,
								shouldValidate: true,
							});
						}}
						rules={{
							required: {
								value: true,
								message: 'URL personalizada é obrigatória',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="description"
						label="Descrição"
						type="text-area"
						helperText={`${form.watch('description')?.length ?? 0}/1000 caracteres`}
						placeholder="Digite uma descrição sobre você"
						rules={{
							required: {
								value: true,
								message: 'Descrição é obrigatória',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="birthday"
						label="Data de Nascimento"
						type="date"
						placeholder="Digite sua data de nascimento"
						rules={{
							required: {
								value: true,
								message: 'Data de nascimento é obrigatória',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="nationality"
						label="Nacionalidade"
						type="text"
						placeholder="Digite a nacionalidade"
						rules={{
							required: {
								value: true,
								message: 'Nacionalidade é obrigatória',
							},
						}}
					/>

					<Stack direction="row" className="gap-4">
						<FormInput
							control={form.control}
							name="phone"
							label="Telefone"
							type="tel"
							className="w-full"
							placeholder="+55 11 99999-9999"
							rules={{
								required: {
									value: true,
									message: 'Telefone é obrigatório',
								},
							}}
						/>
						<FormInput
							control={form.control}
							name="whatsapp"
							label="WhatsApp"
							type="tel"
							className="w-full"
							placeholder="+55 11 99999-9999"
							rules={{
								required: {
									value: true,
									message: 'WhatsApp é obrigatório',
								},
							}}
						/>
					</Stack>

					<Button type="submit" disabled={form.formState.isSubmitting}>
						<Button.Text>
							{form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
						</Button.Text>
					</Button>
				</Stack>
			</form>
		</Stack>
	);
};
