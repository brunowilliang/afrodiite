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
	onSubmit: (data: EscortProfile['information']) => void;
	isSubmitting: boolean;
};

export const InformationTab = ({ onSubmit, isSubmitting }: Props) => {
	const { profile } = useRouteContext({
		from: '/{-$locale}/(admin)/dashboard',
	});

	const informationForm = useForm({
		resolver: zodResolver(profileSchema.information),
		mode: 'onChange',
		defaultValues: extractSchemaFields<EscortProfile['information']>(
			profileSchema.information,
			profile,
		),
	});

	return (
		<Stack className="gap-5">
			<Badge>
				<Badge.Text>Informações</Badge.Text>
			</Badge>

			<form onSubmit={informationForm.handleSubmit(onSubmit)}>
				<Stack className="gap-4">
					<FormInput
						control={informationForm.control}
						name="artist_name"
						label="Nome Artístico"
						type="text"
						placeholder="Digite seu nome artístico"
					/>
					<FormInput
						control={informationForm.control}
						name="slug"
						label="URL Personalizada (Slug)"
						type="text"
						placeholder="ex: meu-nome-artistico"
					/>
					<FormInput
						control={informationForm.control}
						name="description"
						label="Descrição"
						type="text"
						placeholder="Digite uma descrição sobre você"
					/>
					<FormInput
						control={informationForm.control}
						name="birthday"
						label="Data de Nascimento"
						type="date"
						placeholder="Digite sua data de nascimento"
					/>
					<FormInput
						control={informationForm.control}
						name="nationality"
						label="Nacionalidade"
						type="text"
						placeholder="Digite a nacionalidade"
					/>

					<Stack direction="row" className="gap-4">
						<FormInput
							control={informationForm.control}
							name="phone"
							label="Telefone"
							type="tel"
							className="w-full"
							placeholder="+55 11 99999-9999"
						/>
						<FormInput
							control={informationForm.control}
							name="whatsapp"
							label="WhatsApp"
							type="tel"
							className="w-full"
							placeholder="+55 11 99999-9999"
						/>
					</Stack>

					<Button
						type="submit"
						disabled={informationForm.formState.isSubmitting || isSubmitting}
					>
						<Button.Text>
							{informationForm.formState.isSubmitting || isSubmitting
								? 'Salvando...'
								: 'Salvar'}
						</Button.Text>
					</Button>
				</Stack>
			</form>
		</Stack>
	);
};
