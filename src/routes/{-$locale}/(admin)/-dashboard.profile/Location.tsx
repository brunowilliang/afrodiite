import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
import { api } from '@/lib/api';
import { locationSchema } from './schema';

const schema = locationSchema;

type LocationTabProps = { onClose?: () => void };

export const LocationTab = ({ onClose }: LocationTabProps) => {
	const router = useRouter();
	const { session, profile } = useRouteContext({ from: '/{-$locale}' });

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	const handleSubmit = (values: z.infer<typeof schema>) => {
		console.log(values);
		updateProfile.mutateAsync(
			{
				id: session?.user.id,
				...values,
			},
			{
				onSuccess: () => {
					toast.success('Profile updated');
					router.invalidate();
					onClose?.();
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
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: {
			country: profile?.country ?? 'Portugal',
			state: profile?.state ?? '',
			city: profile?.city ?? '',
			neighborhood: profile?.neighborhood ?? '',
		},
	});

	return (
		<Form
			validationBehavior="aria"
			onSubmit={form.handleSubmit(handleSubmit)}
			className="w-full space-y-3"
		>
			<Controller
				control={form.control}
				name="city"
				render={({ field, fieldState }) => (
					<Input
						label="Cidade"
						isRequired
						value={field.value}
						onValueChange={field.onChange}
						onBlur={field.onBlur}
						ref={field.ref}
						name={field.name}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					/>
				)}
			/>

			<Controller
				control={form.control}
				name="state"
				render={({ field, fieldState }) => (
					<Input
						label="Estado"
						isRequired
						value={field.value}
						onValueChange={field.onChange}
						onBlur={field.onBlur}
						ref={field.ref}
						name={field.name}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					/>
				)}
			/>

			<Controller
				control={form.control}
				name="neighborhood"
				render={({ field, fieldState }) => (
					<Input
						label="Bairro"
						isRequired
						value={field.value}
						onValueChange={field.onChange}
						onBlur={field.onBlur}
						ref={field.ref}
						name={field.name}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					/>
				)}
			/>

			<Controller
				control={form.control}
				name="country"
				render={({ field, fieldState }) => (
					<Input
						label="País"
						description="No momento, não é possível alterar o país"
						isDisabled
						value={field.value}
						onValueChange={field.onChange}
						onBlur={field.onBlur}
						ref={field.ref}
						name={field.name}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					/>
				)}
			/>

			<Button isLoading={updateProfile.isPending} type="submit">
				Salvar
			</Button>
		</Form>
	);
};
