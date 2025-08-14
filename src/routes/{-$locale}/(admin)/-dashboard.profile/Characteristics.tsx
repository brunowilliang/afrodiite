import {
	Button,
	Form,
	Input,
	NumberInput,
	Select,
	SelectItem,
} from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ProfileUpdate } from '@/api/utils/types/escort';
import { Badge } from '@/components/core/Badge';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/api';

export const CharacteristicsTab = () => {
	const router = useRouter();
	const { session, profile } = useRouteContext({ from: '/{-$locale}' });

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	const handleSubmit = (values: ProfileUpdate) => {
		updateProfile.mutateAsync(
			{
				id: session?.user.id,
				...values,
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
		mode: 'onChange',
		values: (profile ?? {}) as Partial<ProfileUpdate>,
	});

	return (
		<Stack className="gap-5">
			<Badge>
				<Badge.Text>Características</Badge.Text>
			</Badge>

			<Form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
				<Stack className="w-full gap-4">
					<Select label="Select o seu gênero" isRequired>
						<SelectItem key="male">Masculino</SelectItem>
						<SelectItem key="female">Feminino</SelectItem>
					</Select>

					<NumberInput
						isRequired
						label="Idade"
						placeholder="Digite sua idade"
						size="md"
						className="w-full"
					/>

					<Input
						isRequired
						label="Cor dos olhos"
						placeholder="Digite a cor dos olhos"
						size="md"
						className="w-full"
					/>
					<Input
						isRequired
						label="Cor do cabelo"
						placeholder="Digite a cor do cabelo"
						size="md"
						className="w-full"
					/>

					<NumberInput
						isRequired
						label="Altura"
						placeholder="Digite a sua altura"
						size="md"
						className="w-full"
					/>

					<NumberInput
						isRequired
						label="Peso"
						placeholder="Digite o seu peso"
						size="md"
						className="w-full"
					/>

					<Select label="Etnia" isRequired>
						<SelectItem key="white">Branco</SelectItem>
						<SelectItem key="black">Negro</SelectItem>
						<SelectItem key="brown">Pardo</SelectItem>
						<SelectItem key="indigenous">Indígena</SelectItem>
						<SelectItem key="other">Outro</SelectItem>
					</Select>

					<Input
						isRequired
						label="Idiomas"
						placeholder="Digite os idiomas que você fala"
						size="md"
						className="w-full"
					/>
					<Select label="Preferência sexual" isRequired>
						<SelectItem key="male">Masculino</SelectItem>
						<SelectItem key="female">Feminino</SelectItem>
						<SelectItem key="both">Ambos</SelectItem>
					</Select>

					<Select label="Tem silicone?" isRequired>
						<SelectItem key="yes">Sim</SelectItem>
						<SelectItem key="no">Não</SelectItem>
					</Select>

					<Select label="Tem tatuagens?" isRequired>
						<SelectItem key="yes">Sim</SelectItem>
						<SelectItem key="no">Não</SelectItem>
					</Select>

					<Select label="Tem piercing?" isRequired>
						<SelectItem key="yes">Sim</SelectItem>
						<SelectItem key="no">Não</SelectItem>
					</Select>

					<Select label="Fumante?" isRequired>
						<SelectItem key="yes">Sim</SelectItem>
						<SelectItem key="no">Não</SelectItem>
					</Select>

					<Button type="submit" isLoading={updateProfile.isPending}>
						{updateProfile.isPending ? 'Salvando...' : 'Salvar'}
					</Button>
				</Stack>
			</Form>
		</Stack>
	);
};
