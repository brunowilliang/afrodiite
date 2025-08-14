import { Button, Chip, DateInput, Form, Input, Textarea } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ProfileUpdate } from '@/api/utils/types/escort';
import { Stack } from '@/components/core/Stack';
import { PhoneInput } from '@/components/heroui/NumberInput';
import { api } from '@/lib/api';

export const InformationTab = () => {
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
			<Chip color="default" size="lg" variant="flat" radius="sm">
				Informações
			</Chip>

			<Form
				validationBehavior="aria"
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<Stack className="w-full gap-4">
					<Input
						isRequired
						label="Nome Artístico"
						placeholder="Digite seu nome artístico"
						size="md"
						className="w-full"
					/>
					<Input
						isRequired
						label="Slug"
						placeholder="Sua URL personalizada"
						size="md"
						className="w-full"
					/>

					<Textarea
						isRequired
						label="Descrição"
						placeholder="Digite uma descrição sobre você"
						size="md"
						className="w-full"
						minRows={10}
						maxRows={15}
						description={'Máximo de 1000 caracteres'}
					/>

					<DateInput
						isRequired
						label="Data de Nascimento"
						size="md"
						className="w-full"
						granularity="day"
					/>

					<Input
						isRequired
						label="Nacionalidade"
						placeholder="Digite a sua nacionalidade"
						size="md"
						className="w-full"
					/>

					<PhoneInput
						label="Telefone"
						defaultCountry="PT"
						onChange={(v) => console.log(v)}
					/>
					<PhoneInput
						label="WhatsApp"
						defaultCountry="PT"
						onChange={(v) => console.log(v)}
					/>

					<Button
						color="primary"
						isLoading={updateProfile.isPending}
						size="md"
						type="submit"
					>
						Salvar
					</Button>
				</Stack>
			</Form>
		</Stack>
	);
};
