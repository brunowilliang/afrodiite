import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useLoaderData, useRouter } from '@tanstack/react-router';
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

export const LocationTab = () => {
	const router = useRouter();
	const { profile } = useLoaderData({ from: '/{-$locale}' });

	// Lista de distritos únicos
	const districtOptions = useMemo(() => {
		return [...new Set(PortugalDistricts.map((item) => item.district))]
			.filter(Boolean)
			.sort();
	}, []);

	// Lista de cidades filtradas baseado no distrito selecionado
	const getCitiesByDistrict = (selectedDistrict: string | undefined) => {
		if (!selectedDistrict) return [];

		return PortugalDistricts.filter(
			(item) => item.district === selectedDistrict,
		)
			.map((item) => item.city)
			.sort();
	};

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions({
			onSuccess: () => {
				toast.success('Profile updated');
				router.invalidate();
				if (!profile?.is_onboarding_complete) {
					router.navigate({ to: '/{-$locale}/dashboard' });
				}
			},
			onError: (error) => {
				console.error(error);
				toast.error('Error updating profile', {
					description: error.message,
				});
			},
		}),
	);

	const handleSubmit = (values: z.infer<typeof schema>) => {
		updateProfile.mutateAsync({ ...values });
	};

	const form = useForm({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: {
			district: profile?.district ?? '',
			city: profile?.city ?? '',
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
							form.setValue('city', '');
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
				name="city"
				render={({ field, fieldState }) => (
					<Input.AutoComplete
						label="Cidade"
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

			<Button size="md" isLoading={updateProfile.isPending} type="submit">
				Salvar
			</Button>
		</Form>
	);
};
