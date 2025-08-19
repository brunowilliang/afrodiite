import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseDate, toCalendarDate } from '@internationalized/date';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import slugify from 'slugify';
import { toast } from 'sonner';
import z from 'zod';
import { Icon } from '@/components/core/Icon';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
import { api } from '@/lib/api';
import { Countries } from '@/utils/lists/Countries';
import { informationSchema } from './schema';

const schema = informationSchema;

type InformationTabProps = { onClose?: () => void };

export const InformationTab = ({ onClose }: InformationTabProps) => {
	const router = useRouter();
	const { session, profile } = useRouteContext({ from: '/{-$locale}' });

	// Lista de nacionalidades usando o JSON local (gentílicos!)
	const nationalityOptions = useMemo(() => {
		return Countries.map((country) => {
			const gentilico = country.gentilico;
			return gentilico.charAt(0).toUpperCase() + gentilico.slice(1);
		})
			.filter((item, index, arr) => arr.indexOf(item) === index) // Remove duplicatas
			.sort();
	}, []);

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
					const message =
						error instanceof Error ? error.message : String(error);
					console.error(error);
					if (/slug/i.test(message) && /(unique|duplic)/i.test(message)) {
						toast.error('Slug já em uso', {
							description: 'Escolha outro slug, ele precisa ser único.',
						});
						return;
					}
					toast.error('Error updating profile', {
						description: message,
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

	const slugOptions = { lower: true, strict: true, locale: 'pt' as const };
	const isSlugManualRef = useRef<boolean>(Boolean(profile?.slug));

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
						onValueChange={(v) => {
							field.onChange(v);
							if (!isSlugManualRef.current) {
								const auto = slugify(v ?? '', slugOptions);
								form.setValue('slug', auto, { shouldValidate: true });
							}
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
						endContent={
							<Button
								type="button"
								size="sm"
								isIconOnly
								variant="flat"
								color="default"
								className="h-full px-5"
								onClick={() => {
									isSlugManualRef.current = false;
									const fromName = form.getValues('artist_name') ?? '';
									const auto = slugify(fromName, slugOptions);
									form.setValue('slug', auto, { shouldValidate: true });
								}}
							>
								<Icon name="Refresh" size="18" />
							</Button>
						}
						value={field.value ?? ''}
						onValueChange={(v) => {
							isSlugManualRef.current = true;
							const sanitized = slugify(v ?? '', slugOptions);
							field.onChange(sanitized);
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
					<Input.AutoComplete
						label="Nacionalidade"
						isRequired
						inputValue={field.value ?? ''}
						onInputChange={field.onChange}
						onSelectionChange={(key) => {
							field.onChange(key);
						}}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						{nationalityOptions.map((nationality) => (
							<Input.AutoComplete.Item key={nationality}>
								{nationality}
							</Input.AutoComplete.Item>
						))}
					</Input.AutoComplete>
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
