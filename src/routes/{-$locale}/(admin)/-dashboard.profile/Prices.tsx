import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { I18nProvider } from '@react-aria/i18n';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { DEFAULT_PRICES, SLOTS, type Slot } from '@/api/utils/defaults/escort';
import { Stack } from '@/components/core/Stack';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
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
	travel_daily: 'Viagem',
};

export const PricesTab = () => {
	const router = useRouter();
	const { session, profile } = useRouteContext({ from: '/{-$locale}' });

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	const handleSubmit = (values: z.infer<typeof schema>) => {
		const prices = (SLOTS as readonly Slot[]).map((slot) => ({
			slot,
			...values[slot],
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
		defaultValues: (profile?.prices?.length
			? Object.fromEntries(
					profile.prices.map(
						({ slot, is_available, amount = 0, currency = 'EUR' }) => [
							slot,
							{ is_available, amount, currency },
						],
					),
				)
			: Object.fromEntries(
					DEFAULT_PRICES.map(
						({ slot, is_available, amount = 0, currency = 'EUR' }) => [
							slot,
							{ is_available, amount, currency },
						],
					),
				)) as z.infer<typeof schema>,
	});

	return (
		<I18nProvider locale="en-US">
			<Form
				validationBehavior="aria"
				onSubmit={form.handleSubmit(handleSubmit)}
				className="w-full space-y-6"
			>
				<Stack direction="column" className="w-full gap-6">
					{(SLOTS as readonly Slot[]).map((slot) => {
						const active = form.watch(`${slot}.is_available`);
						return (
							<Stack key={slot} direction="column" className="w-full gap-3">
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
								<Controller
									control={form.control}
									name={`${slot}.amount` as const}
									rules={{ required: active }}
									render={({ field, fieldState }) => (
										<Input.Number
											isRequired={active}
											label="Valor"
											minValue={0}
											maxValue={999999}
											formatOptions={{
												style: 'currency',
												currency: 'EUR',
												currencyDisplay: 'symbol',
											}}
											isDisabled={!active}
											value={field.value as number}
											onValueChange={field.onChange}
											onBlur={field.onBlur}
											isInvalid={!!fieldState.error}
											errorMessage={fieldState.error?.message}
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