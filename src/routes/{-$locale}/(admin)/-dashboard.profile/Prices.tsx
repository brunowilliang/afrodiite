import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { I18nProvider } from '@react-aria/i18n';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { DEFAULT_PRICES, SLOTS } from '@/api/utils/defaults/escort';
import type { Slot } from '@/api/utils/types/escort';
import { Stack } from '@/components/core/Stack';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
import { toast } from '@/components/heroui/Toast';
import { api } from '@/lib/api';
import { pricesSchema } from './schema';

const schema = pricesSchema;

type PricesTabProps = { onClose?: () => void };

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

export const PricesTab = ({ onClose }: PricesTabProps) => {
	const router = useRouter();
	const { session, profile } = useRouteContext({ from: '/{-$locale}' });

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	const handleSubmit = (values: z.infer<typeof schema>) => {
		const prices = (SLOTS as readonly Slot[]).map((slot) => ({
			slot,
			is_available: values[slot].is_available as boolean,
			amount: (values[slot].amount as number) || 0,
			negotiated: values[slot].negotiated as boolean,
			currency: (values[slot].currency as 'EUR') || 'EUR',
		}));
		updateProfile.mutateAsync(
			{
				id: session?.user.id,
				prices,
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
					DEFAULT_PRICES.map(
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
		const anyActive = (SLOTS as readonly Slot[]).some((slot) =>
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
				<Stack direction="column" className="w-full gap-6">
					{(SLOTS as readonly Slot[]).map((slot) => {
						const active = form.watch(`${slot}.is_available`);
						const negotiated = form.watch(`${slot}.negotiated`);
						return (
							<Stack key={slot} direction="column" className="w-full gap-3">
								<div className="flex items-center justify-between">
									<Controller
										control={form.control}
										name={`${slot}.is_available` as const}
										render={({ field }) => (
											<Input.Switch
												isSelected={field.value}
												onValueChange={field.onChange}
											>
												{slotLabels[slot]}
											</Input.Switch>
										)}
									/>
									{active && (
										<Controller
											control={form.control}
											name={`${slot}.negotiated` as const}
											render={({ field }) => (
												<Input.Switch
													isSelected={field.value}
													onValueChange={field.onChange}
													size="sm"
												>
													A combinar?
												</Input.Switch>
											)}
										/>
									)}
								</div>
								<Controller
									control={form.control}
									name={`${slot}.amount` as const}
									render={({ field, fieldState }) => (
										<Input.Number
											isRequired={active && !negotiated}
											label="Valor"
											minValue={0}
											maxValue={999999}
											formatOptions={{
												style: 'currency',
												currency: 'EUR',
												currencyDisplay: 'symbol',
											}}
											isDisabled={!active || negotiated}
											value={field.value as number}
											onValueChange={field.onChange}
											onBlur={field.onBlur}
											isInvalid={
												active && !negotiated ? !!fieldState.error : false
											}
											errorMessage={
												active && !negotiated
													? fieldState.error?.message
													: undefined
											}
										/>
									)}
								/>
							</Stack>
						);
					})}
				</Stack>
				<Button isLoading={updateProfile.isPending} type="submit">
					Salvar
				</Button>
			</Form>
		</I18nProvider>
	);
};
