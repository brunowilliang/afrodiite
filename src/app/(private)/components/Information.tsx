'use client';

import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseDate, toCalendarDate } from '@internationalized/date';
import { useServerAction } from '@orpc/react/hooks';
import { useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import slugify from 'slugify';
import {
	escortProfileSchema,
	IProfile,
} from '@/api/utils/schemas/escort-forms';
import { Button } from '@/components/core/Button';
import { Icon } from '@/components/core/Icon';
import { Input } from '@/components/core/Input';
import { toast } from '@/components/core/Toast';
import { Countries } from '@/utils/lists/Countries';
import { updateProfile } from './actions/updateProfile';

const formSchema = escortProfileSchema.pick({
	artist_name: true,
	slug: true,
	description: true,
	birthday: true,
	nationality: true,
	phone: true,
	whatsapp: true,
});

type Props = {
	profile?: IProfile.Select;
};

export const Information = ({ profile }: Props) => {
	const { execute, status } = useServerAction(updateProfile);

	const nationalityOptions = useMemo(() => {
		return Countries.map((country) => {
			const gentilico = country.gentilico;
			return gentilico.charAt(0).toUpperCase() + gentilico.slice(1);
		})
			.filter((item, index, arr) => arr.indexOf(item) === index)
			.sort();
	}, []);

	const handleSubmit = async () => {
		const [error] = await execute(form.getValues());

		if (error) {
			toast.error(error?.message ?? 'Erro ao salvar perfil');
			return;
		}

		toast.success('Perfil salvo com sucesso!');
		// router.refresh();
	};

	const form = useForm({
		resolver: zodResolver(formSchema),
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
						description={`https://afrodiite.com/escort/${profile?.public_id}/${form.getValues('slug')}`}
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
						value={field.value ? parseDate(field.value) : (null as any)}
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

			<Button size="md" isLoading={status === 'pending'} type="submit">
				Salvar
			</Button>
		</Form>
	);
};
