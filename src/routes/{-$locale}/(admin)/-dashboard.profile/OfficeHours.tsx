import { Form, Switch, TimeInput } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ProfileUpdate } from '@/api/utils/types/escort';
import { Badge } from '@/components/core/Badge';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/api';

export const OfficeHoursTab = () => {
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
				<Badge.Text>Horários de trabalho</Badge.Text>
			</Badge>

			<Form onSubmit={form.handleSubmit(handleSubmit)}>
				<Stack className="w-full gap-4">
					{[...Array(7)].map((_, index) => (
						<Stack direction="row" className="w-full gap-4" key={index}>
							<TimeInput size="md" label="Inicio" />
							<TimeInput size="md" label="Fim" />
							<Switch size="md" defaultSelected>
								Ativado
							</Switch>
						</Stack>
					))}
				</Stack>
			</Form>
		</Stack>
	);
};
