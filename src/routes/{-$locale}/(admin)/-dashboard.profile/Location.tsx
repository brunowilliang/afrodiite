import { useForm } from 'react-hook-form';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { FormInput } from '@/components/core/Inputs/FormInput';
import { Stack } from '@/components/core/Stack';
import type { profile } from '@/queries/profile';
import type { EscortProfile } from '@/schemas/forms/profile';

interface Props {
	id: string;
	data?: Partial<EscortProfile['location']>;
	onSubmit: ReturnType<typeof profile.update.useMutation>;
}

export const LocationTab = ({ id, data, onSubmit }: Props) => {
	const form = useForm({
		mode: 'onChange',
		values: {
			...data,
			country: 'Portugal',
		},
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
				<Badge.Text>Localização</Badge.Text>
			</Badge>

			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Stack className="gap-4">
					<FormInput
						control={form.control}
						name="city"
						label="Cidade"
						type="text"
						placeholder="Digite a cidade"
						rules={{
							required: {
								value: true,
								message: 'Cidade é obrigatória',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="state"
						label="Estado"
						type="text"
						placeholder="Digite o estado"
						rules={{
							required: {
								value: true,
								message: 'Estado é obrigatório',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="neighborhood"
						label="Bairro"
						type="text"
						placeholder="Digite o bairro"
						rules={{
							required: {
								value: true,
								message: 'Bairro é obrigatório',
							},
						}}
					/>
					<FormInput
						control={form.control}
						name="country"
						label="País"
						type="text"
						helperText="No momento, não é possível alterar o país"
						disabled
						rules={{
							required: {
								value: true,
								message: 'País é obrigatório',
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
