import { useForm } from 'react-hook-form';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { FormInput } from '@/components/core/Inputs/FormInput';
import { Stack } from '@/components/core/Stack';
import type { profile } from '@/queries/profile';
import type { EscortProfile } from '@/schemas/forms/profile';

interface Props {
	id: string;
	data?: EscortProfile['characteristics'];
	onSubmit: ReturnType<typeof profile.update.useMutation>;
}

export const CharacteristicsTab = ({ id, data, onSubmit }: Props) => {
	const form = useForm({
		mode: 'onChange',
		values: { characteristics: data?.characteristics },
	});

	const handleSubmit = async (values: typeof data) => {
		await onSubmit.mutateAsync({
			id,
			characteristics: values?.characteristics ?? {},
		});
	};

	return (
		<Stack className="gap-5">
			<Badge>
				<Badge.Text>Características</Badge.Text>
			</Badge>

			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Stack className="gap-4">
					<FormInput
						control={form.control}
						name="characteristics.gender"
						type="select"
						label="Gênero"
						placeholder="Selecione uma opção"
						options={[
							{ value: 'male', label: 'Masculino' },
							{ value: 'female', label: 'Feminino' },
						]}
						rules={{
							required: {
								value: true,
								message: 'Gênero é obrigatório',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="characteristics.age"
						label="Idade"
						type="number"
						placeholder="Digite sua idade"
						rules={{
							required: {
								value: true,
								message: 'Idade é obrigatória',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="characteristics.eye_color"
						label="Cor dos olhos"
						type="text"
						placeholder="Digite a cor dos olhos"
						rules={{
							required: {
								value: true,
								message: 'Cor dos olhos é obrigatória',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="characteristics.hair_color"
						label="Cor do cabelo"
						type="text"
						placeholder="Digite a cor do cabelo"
						rules={{
							required: {
								value: true,
								message: 'Cor do cabelo é obrigatória',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="characteristics.height"
						label="Altura"
						type="number"
						placeholder="Digite a altura"
						rules={{
							required: {
								value: true,
								message: 'Altura é obrigatória',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="characteristics.weight"
						label="Peso"
						type="number"
						placeholder="Digite o peso"
						rules={{
							required: {
								value: true,
								message: 'Peso é obrigatório',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="characteristics.ethnicity"
						type="select"
						label="Etnia"
						placeholder="Selecione uma opção"
						options={[
							{ value: 'white', label: 'Branco' },
							{ value: 'black', label: 'Negro' },
							{ value: 'brown', label: 'Pardo' },
							{ value: 'indigenous', label: 'Indígena' },
						]}
						rules={{
							required: {
								value: true,
								message: 'Etnia é obrigatória',
							},
						}}
					/>

					<FormInput
						control={form.control}
						name="characteristics.languages"
						label="Idiomas"
						type="text"
						placeholder="Digite os idiomas"
						rules={{
							required: {
								value: true,
								message: 'Idiomas é obrigatório',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="characteristics.sexual_preference"
						type="select"
						label="Preferência sexual"
						placeholder="Selecione uma opção"
						options={[
							{ value: 'male', label: 'Homem' },
							{ value: 'female', label: 'Mulher' },
							{ value: 'both', label: 'Ambos' },
						]}
						rules={{
							required: {
								value: true,
								message: 'Preferência sexual é obrigatória',
							},
						}}
					/>

					<FormInput
						control={form.control}
						name="characteristics.silicone"
						type="select"
						label="Tem silicone?"
						placeholder="Selecione uma opção"
						options={[
							{ value: 'yes', label: 'Sim' },
							{ value: 'no', label: 'Não' },
						]}
						rules={{
							required: {
								value: true,
								message: 'Tem silicone é obrigatório',
							},
						}}
					/>

					<FormInput
						control={form.control}
						name="characteristics.tattoos"
						type="select"
						label="Tem tatuagens?"
						placeholder="Selecione uma opção"
						options={[
							{ value: 'yes', label: 'Sim' },
							{ value: 'no', label: 'Não' },
						]}
						rules={{
							required: {
								value: true,
								message: 'Tattoos é obrigatório',
							},
						}}
					/>

					<FormInput
						control={form.control}
						name="characteristics.piercings"
						type="select"
						label="Piercings"
						placeholder="Selecione uma opção"
						options={[
							{ value: 'yes', label: 'Sim' },
							{ value: 'no', label: 'Não' },
						]}
						rules={{
							required: {
								value: true,
								message: 'Piercings é obrigatório',
							},
						}}
					/>

					<FormInput
						control={form.control}
						name="characteristics.smoker"
						type="select"
						label="Fumante?"
						placeholder="Selecione uma opção"
						options={[
							{ value: 'yes', label: 'Sim' },
							{ value: 'no', label: 'Não' },
						]}
						rules={{
							required: {
								value: true,
								message: 'Fumante é obrigatório',
							},
						}}
					/>

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
