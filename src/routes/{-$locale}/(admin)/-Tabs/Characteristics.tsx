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
	onSubmit: (data: EscortProfile['characteristics']) => void;
	isSubmitting: boolean;
};

export const CharacteristicsTab = ({ onSubmit, isSubmitting }: Props) => {
	const { profile } = useRouteContext({
		from: '/{-$locale}/(admin)/dashboard',
	});

	const characteristicsForm = useForm({
		resolver: zodResolver(profileSchema.characteristics),
		mode: 'onChange',
		defaultValues: extractSchemaFields<EscortProfile['characteristics']>(
			profileSchema.characteristics,
			profile,
		),
	});

	return (
		<Stack className="gap-5">
			<Badge>
				<Badge.Text>Características</Badge.Text>
			</Badge>

			<form onSubmit={characteristicsForm.handleSubmit(onSubmit)}>
				<Stack className="gap-4">
					<FormInput
						control={characteristicsForm.control}
						name="age"
						label="Idade"
						type="number"
						placeholder="Digite sua idade"
					/>

					<Button
						type="submit"
						disabled={
							characteristicsForm.formState.isSubmitting || isSubmitting
						}
					>
						<Button.Text>
							{characteristicsForm.formState.isSubmitting || isSubmitting
								? 'Salvando...'
								: 'Salvar'}
						</Button.Text>
					</Button>
				</Stack>
			</form>
		</Stack>
	);
};
