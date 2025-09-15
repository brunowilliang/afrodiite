import { Card, Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { I18nProvider } from '@react-aria/i18n';
import { useMutation } from '@tanstack/react-query';
import { useLoaderData, useRouter } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import type { Slot } from '@/api/utils/schemas/escort-core';
import { createDefaults, SlotEnum } from '@/api/utils/schemas/escort-core';
import { Icon } from '@/components/core/Icon';
import { Stack } from '@/components/core/Stack';
import { Badge } from '@/components/heroui/Badge';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
import { toast } from '@/components/heroui/Toast';
import { api } from '@/lib/api';
import { pricesSchema } from './schema';

const schema = pricesSchema;

const slotLabels: Record<Slot, string> = {
	'30m': '30 minutos',
	'1h': '1 hora',
	'2h': '2 horas',
	'4h': '4 horas',
	daily: 'Diária',
	overnight: 'Pernoite',
	travel: 'Viagem',
	outcall: 'Outcall',
};

export const PricesTab = () => {
	const router = useRouter();
	const { profile } = useLoaderData({ from: '/{-$locale}' });

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
		const prices = (SlotEnum.options as readonly Slot[]).map((slot) => ({
			slot,
			is_available: values[slot].is_available as boolean,
			amount: (values[slot].amount as number) || 0,
			negotiated: values[slot].negotiated as boolean,
			currency: (values[slot].currency as 'EUR') || 'EUR',
		}));
		updateProfile.mutateAsync({ prices });
	};

	const form = useForm({
		resolver: zodResolver(schema) as any,
		mode: 'onChange',
		defaultValues: profile?.prices?.length
			? Object.fromEntries(
					profile.prices.map(
						({
							slot,
							is_available,
							amount = 0,
							negotiated = false,
							currency = 'EUR',
						}) => [slot, { is_available, amount, negotiated, currency }],
					),
				)
			: Object.fromEntries(
					createDefaults
						.prices()
						.map(
							({
								slot,
								is_available,
								amount = 0,
								negotiated = false,
								currency = 'EUR',
							}) => [slot, { is_available, amount, negotiated, currency }],
						),
				),
	});

	const onInvalid = () => {
		// Show toast only when no slot is active; otherwise, let field errors guide the user
		const anyActive = (SlotEnum.options as readonly Slot[]).some((slot) =>
			form.getValues(`${slot}.is_available` as const),
		);
		if (!anyActive) {
			toast.error('Ative pelo menos um item para salvar.');
		}
	};

	return (
		<I18nProvider locale="en-US">
			<Form
				validationBehavior="aria"
				onSubmit={form.handleSubmit(handleSubmit as any, onInvalid)}
				className="w-full space-y-6"
			>
				<Stack className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
					{(SlotEnum.options as readonly Slot[]).map((slot) => {
						const isActive = form.watch(`${slot}.is_available`);
						const negotiated = form.watch(`${slot}.negotiated`);
						return (
							<Card key={slot} className="flex w-full flex-col gap-3 p-4">
								<Stack direction="row" className="w-full justify-between">
									<Badge>
										<Icon name="Stars" variant="bulk" size="20" />
										{slotLabels[slot]}
									</Badge>
									<Controller
										control={form.control}
										name={`${slot}.is_available` as const}
										render={({ field }) => (
											<Input.Switch
												isSelected={field.value}
												onValueChange={field.onChange}
											>
												{isActive ? 'Ativado' : 'Desativado'}
											</Input.Switch>
										)}
									/>
								</Stack>
								<Stack direction="row" className="w-full gap-4">
									<Controller
										control={form.control}
										name={`${slot}.amount` as const}
										render={({ field, fieldState }) => (
											<Input.Number
												isRequired={isActive && !negotiated}
												label="Valor"
												minValue={0}
												variant="faded"
												maxValue={999999}
												formatOptions={{
													style: 'currency',
													currency: 'EUR',
													currencyDisplay: 'symbol',
												}}
												isDisabled={!isActive || negotiated}
												value={field.value as number}
												onValueChange={field.onChange}
												onBlur={field.onBlur}
												isInvalid={
													isActive && !negotiated ? !!fieldState.error : false
												}
												errorMessage={
													isActive && !negotiated
														? fieldState.error?.message
														: undefined
												}
											/>
										)}
									/>
									<Controller
										control={form.control}
										name={`${slot}.negotiated` as const}
										render={({ field }) => (
											<Input.Switch
												isSelected={isActive && field.value}
												className="w-full"
												onValueChange={field.onChange}
												isDisabled={!isActive}
												size="sm"
											>
												A combinar?
											</Input.Switch>
										)}
									/>
								</Stack>
							</Card>
						);
					})}
				</Stack>
				<Button size="md" isLoading={updateProfile.isPending} type="submit">
					Salvar
				</Button>
			</Form>
		</I18nProvider>
	);
};
