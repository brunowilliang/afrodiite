import { zodResolver } from '@hookform/resolvers/zod';
import { useRouteContext } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { FormInput } from '@/components/core/FormInput';
import { Stack } from '@/components/core/Stack';
import { type EscortProfile, profileSchema } from '@/schemas/forms/profile';
import { extractSchemaFields } from '@/utils/extractSchemaFields';

type Props = {
	onSubmit: (data: EscortProfile['location']) => void;
	isSubmitting: boolean;
};

export const LocationTab = ({ onSubmit, isSubmitting }: Props) => {
	const { profile } = useRouteContext({
		from: '/{-$locale}/(admin)/dashboard',
	});

	const locationForm = useForm({
		resolver: zodResolver(profileSchema.location),
		mode: 'onChange',
		defaultValues: extractSchemaFields<EscortProfile['location']>(
			profileSchema.location,
			profile,
		),
	});

	return (
		<Stack className="gap-5">
			<Badge>
				<Badge.Text>Localização</Badge.Text>
			</Badge>

			<form onSubmit={locationForm.handleSubmit(onSubmit)}>
				<Stack className="gap-4">
					<FormInput
						control={locationForm.control}
						name="city"
						label="Cidade"
						type="text"
						placeholder="Digite a cidade"
					/>
					<FormInput
						control={locationForm.control}
						name="country"
						label="País"
						type="text"
						placeholder="Digite o país"
					/>
					<FormInput
						control={locationForm.control}
						name="state"
						label="Estado"
						type="text"
						placeholder="Digite o estado"
					/>
					<FormInput
						control={locationForm.control}
						name="neighborhood"
						label="Bairro"
						type="text"
						placeholder="Digite o bairro"
					/>

					<Button
						type="submit"
						disabled={locationForm.formState.isSubmitting || isSubmitting}
					>
						<Button.Text>
							{locationForm.formState.isSubmitting || isSubmitting
								? 'Salvando...'
								: 'Salvar'}
						</Button.Text>
					</Button>
				</Stack>
			</form>
		</Stack>
	);
};
