import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseDate, toCalendarDate } from '@internationalized/date';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
import { api } from '@/lib/api';

const schema = z.object({
	artist_name: z.string().min(1, { message: 'Nome Artístico é obrigatório' }),
	slug: z.string().min(1, { message: 'Slug é obrigatório' }),
	description: z.string().min(1, { message: 'Descrição é obrigatória' }),
	birthday: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, {
			message: 'Data de Nascimento é obrigatória',
		})
		.nonempty({ message: 'Data de Nascimento é obrigatória' }),
	nationality: z.string().min(1, { message: 'Nacionalidade é obrigatória' }),
	phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
	whatsapp: z.string().min(1, { message: 'WhatsApp é obrigatório' }),
});

export const InformationTab = () => {
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
			artist_name: profile?.artist_name ?? '',
			slug: profile?.slug ?? '',
			description: profile?.description ?? '',
			birthday: profile?.birthday ?? '',
			nationality: profile?.nationality ?? '',
			phone: profile?.phone ?? '',
			whatsapp: profile?.whatsapp ?? '',
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
				name="artist_name"
				render={({ field, fieldState }) => (
					<Input
						label="Nome Artístico"
						isRequired
						value={field.value ?? ''}
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
				name="slug"
				render={({ field, fieldState }) => (
					<Input
						label="Slug"
						isRequired
						startContent={
							<div className="pointer-events-none flex items-center">
								<span className="text-default text-small">
									https://afrodiite.com/escort/
								</span>
							</div>
						}
						value={field.value ?? ''}
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
				name="description"
				render={({ field, fieldState }) => (
					<Input.TextArea
						label="Descrição"
						description={'Máximo de 1000 caracteres'}
						isRequired
						value={field.value ?? ''}
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
				name="birthday"
				render={({ field, fieldState }) => (
					<Input.DateInput
						label="Data de Nascimento"
						isRequired
						value={field.value ? parseDate(field.value) : null}
						onChange={(date) => {
							const v = date ? toCalendarDate(date).toString() : null;
							field.onChange(v);
						}}
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
				name="nationality"
				render={({ field, fieldState }) => (
					<Input
						label="Nacionalidade"
						isRequired
						value={field.value ?? ''}
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
				name="phone"
				render={({ field, fieldState }) => (
					<Input.PhoneInput
						label="Telefone"
						defaultCountry="PT"
						onChange={field.onChange}
						onBlur={field.onBlur}
						name={field.name}
						value={field.value ?? ''}
						isRequired
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					/>
				)}
			/>

			<Controller
				control={form.control}
				name="whatsapp"
				render={({ field, fieldState }) => (
					<Input.PhoneInput
						label="WhatsApp"
						defaultCountry="PT"
						onChange={field.onChange}
						onBlur={field.onBlur}
						name={field.name}
						value={field.value ?? ''}
						isRequired
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
