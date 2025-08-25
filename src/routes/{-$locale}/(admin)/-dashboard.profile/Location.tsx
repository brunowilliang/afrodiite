import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
	useLoaderData,
	useRouteContext,
	useRouter,
} from '@tanstack/react-router';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
import { toast } from '@/components/heroui/Toast';
import { api } from '@/lib/api';
import { PortugalDistricts } from '@/utils/lists/Portugal';
import { locationSchema } from './schema';

const schema = locationSchema;

type LocationTabProps = { onClose?: () => void };

export const LocationTab = ({ onClose }: LocationTabProps) => {
	const router = useRouter();
	const { session } = useRouteContext({ from: '/{-$locale}' });
	const { profile } = useLoaderData({ from: '/{-$locale}/(admin)/dashboard' });

	// Lista de distritos únicos
	const districtOptions = useMemo(() => {
		return [...new Set(PortugalDistricts.map((item) => item.distrito))]
			.filter(Boolean)
			.sort();
	}, []);

	// Lista de cidades filtradas baseado no distrito selecionado
	const getCitiesByDistrict = (selectedDistrict: string | undefined) => {
		if (!selectedDistrict) return [];

		return PortugalDistricts.filter(
			(item) => item.distrito === selectedDistrict,
		)
			.map((item) => item.cidade)
			.sort();
	};

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
			district: profile?.district ?? '',
			zone: profile?.zone ?? '',
			country: profile?.country ?? 'Portugal',
		},
	});

	// Observa mudanças no distrito para filtrar cidades
	const selectedDistrict = form.watch('district');
	const cityOptions = useMemo(() => {
		return getCitiesByDistrict(selectedDistrict);
	}, [selectedDistrict]);

	return (
		<Form
			validationBehavior="aria"
			onSubmit={form.handleSubmit(handleSubmit)}
			className="w-full space-y-3"
		>
			<Controller
				control={form.control}
				name="district"
				render={({ field, fieldState }) => (
					<Input.AutoComplete
						label="Distrito"
						isRequired
						placeholder="Digite para buscar distrito"
						inputValue={field.value ?? ''}
						onInputChange={field.onChange}
						onSelectionChange={(key) => {
							field.onChange(key);
							// Limpa a zona quando distrito muda
							form.setValue('zone', '');
						}}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						{districtOptions.map((district) => (
							<Input.AutoComplete.Item key={district}>
								{district}
							</Input.AutoComplete.Item>
						))}
					</Input.AutoComplete>
				)}
			/>

			<Controller
				control={form.control}
				name="zone"
				render={({ field, fieldState }) => (
					<Input.AutoComplete
						label="Zona"
						isRequired
						placeholder={
							selectedDistrict
								? `Digite para buscar cidades em ${selectedDistrict}`
								: 'Primeiro selecione um distrito'
						}
						isDisabled={!selectedDistrict}
						inputValue={field.value ?? ''}
						onInputChange={field.onChange}
						onSelectionChange={(key) => {
							field.onChange(key);
						}}
						onBlur={field.onBlur}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						{cityOptions.map((city) => (
							<Input.AutoComplete.Item key={city}>
								{city}
							</Input.AutoComplete.Item>
						))}
					</Input.AutoComplete>
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
