'use client';

import { Card, Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { I18nProvider } from '@react-aria/i18n';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Slot } from '@/api/utils/schemas/escort-core';
import { createDefaults, SlotEnum } from '@/api/utils/schemas/escort-core';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { Stack } from '@/components/core/Stack';
import { toast } from '@/components/core/Toast';
import { useProfile } from '@/hooks/useProfile';
import { Badge } from '../../components/Badge';

const formSchema = z
	.object(
		Object.fromEntries(
			(SlotEnum.options as readonly Slot[]).map((slot) => [
				slot,
				z
					.object({
						is_available: z.boolean(),
						amount: z.number().optional(),
						negotiated: z.boolean().optional(),
						currency: z.literal('EUR').optional(),
					})
					.superRefine((val, ctx) => {
						if (val.is_available && !val.negotiated && (val.amount ?? 0) < 40) {
							ctx.addIssue({
								code: 'custom',
								message:
									'Quando ativo, o valor deve ser pelo menos €40 ou marque "A combinar".',
								path: ['amount'],
							});
						}
					}),
			]),
		) as Record<Slot, z.ZodObject<any>>,
	)
	.superRefine((val, ctx) => {
		// Pelo menos um slot deve estar ativo (com valor >= 40 ou negociado)
		const anyValid = Object.values(val).some(
			(v: any) => !!v.is_available && ((v.amount ?? 0) >= 40 || !!v.negotiated),
		);
		if (!anyValid) {
			const firstSlot = (SlotEnum.options as readonly Slot[])[0];
			ctx.addIssue({
				code: 'custom',
				message: 'Pelo menos um item deve estar ativo.',
				path: [firstSlot, 'amount'],
			});
		}
	});

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

export const Precos = () => {
	const { profile, updateProfile, isUpdating } = useProfile();

	const handleSubmit = async () => {
		const values = form.getValues();
		const prices = (SlotEnum.options as readonly Slot[]).map((slot) => ({
			slot,
			is_available: values[slot].is_available as boolean,
			amount: (values[slot].amount as number) || 0,
			negotiated: values[slot].negotiated as boolean,
			currency: (values[slot].currency as 'EUR') || 'EUR',
		}));

		await updateProfile({ prices });
	};

	const form = useForm({
		resolver: zodResolver(formSchema) as any,
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
			<Stack className="gap-5">
				<Badge icon="MoneyBag" label="Preços" />
				<Form
					validationBehavior="aria"
					onSubmit={form.handleSubmit(handleSubmit, onInvalid)}
					className="w-full space-y-6"
				>
					<Stack className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
						{(SlotEnum.options as readonly Slot[]).map((slot) => {
							const isActive = form.watch(`${slot}.is_available`);
							const negotiated = form.watch(`${slot}.negotiated`);
							return (
								<Card key={slot} className="flex w-full flex-col gap-3 p-4">
									<Stack direction="row" className="w-full justify-between">
										<Badge icon="Stars" label={slotLabels[slot]} />
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
					<Button size="md" isLoading={isUpdating} type="submit">
						Salvar
					</Button>
				</Form>
			</Stack>
		</I18nProvider>
	);
};
