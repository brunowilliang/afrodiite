import { Button, Form, Input } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ProfileUpdate } from '@/api/utils/types/escort';
import { Badge } from '@/components/core/Badge';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/api';

export const LocationTab = () => {
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
				<Badge.Text>Localização</Badge.Text>
			</Badge>

			<Form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
				<Stack className="w-full gap-4">
					<Input
						isRequired
						label="Cidade"
						placeholder="Digite a cidade onde irá atuar"
						size="md"
						className="w-full"
					/>

					<Input
						isRequired
						label="Estado"
						placeholder="Digite o estado"
						size="md"
						className="w-full"
					/>

					<Input
						isRequired
						label="Bairro"
						placeholder="Digite o bairro"
						size="md"
						className="w-full"
					/>

					<Input
						isRequired
						label="País"
						placeholder="Digite o país"
						size="md"
						className="w-full"
						description="No momento, não é possível alterar o país"
						disabled
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
