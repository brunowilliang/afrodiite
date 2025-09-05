import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseTime } from '@internationalized/date';
import { useMutation } from '@tanstack/react-query';
import {
	useLoaderData,
	useRouteContext,
	useRouter,
} from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { DAYS, DEFAULT_OFFICE_HOURS } from '@/api/utils/defaults/escort';
import type { Day } from '@/api/utils/types/escort';
import { Stack } from '@/components/core/Stack';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
import { toast } from '@/components/heroui/Toast';
import { api } from '@/lib/api';
import { officeHoursSchema } from './schema';

const schema = officeHoursSchema;

export const OfficeHoursTab = () => {
	const router = useRouter();
	const { session } = useRouteContext({ from: '/{-$locale}' });
	const { profile } = useLoaderData({ from: '/{-$locale}/(admin)/dashboard' });

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	const handleSubmit = (values: z.infer<typeof schema>) => {
		const office_hours = (DAYS as readonly Day[]).map((day) => ({
			day,
			is_available: values[day].is_available as boolean,
			start: values[day].start as string,
			end: values[day].end as string,
		}));
		updateProfile.mutateAsync(
			{
				id: session?.user.id,
				office_hours,
			},
			{
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
			},
		);
	};

	const form = useForm({
		resolver: zodResolver(schema) as any,
		mode: 'onChange',
		defaultValues: profile?.office_hours?.length
			? Object.fromEntries(
					profile.office_hours.map(({ day, is_available, start, end }) => [
						day,
						{ is_available, start, end },
					]),
				)
			: Object.fromEntries(
					DEFAULT_OFFICE_HOURS.map(({ day, is_available, start, end }) => [
						day,
						{ is_available, start, end },
					]),
				),
	});

	const onInvalid = () => {
		const anySelected = (DAYS as readonly Day[]).some((d) =>
			form.getValues(`${d}.is_available` as const),
		);
		if (!anySelected) {
			toast.error('Ative pelo menos um dia para salvar os horários.');
		}
	};

	// Helper para verificar se é "dia inteiro" baseado nos valores atuais
	const isFullDay = (day: Day) => {
		const values = form.watch();
		return values[day]?.start === '00:00' && values[day]?.end === '23:59';
	};

	// Helper para definir dia inteiro
	const setFullDay = (day: Day, enabled: boolean) => {
		if (enabled) {
			form.setValue(`${day}.start`, '00:00');
			form.setValue(`${day}.end`, '23:59');
		} else {
			form.setValue(`${day}.start`, '08:00');
			form.setValue(`${day}.end`, '18:00');
		}
	};

	return (
		<Form
			validationBehavior="aria"
			onSubmit={form.handleSubmit(handleSubmit as any, onInvalid)}
			className="w-full space-y-6"
		>
			{(
				[
					['monday', 'Segunda-Feira'],
					['tuesday', 'Terça-Feira'],
					['wednesday', 'Quarta-Feira'],
					['thursday', 'Quinta-Feira'],
					['friday', 'Sexta-Feira'],
					['saturday', 'Sábado'],
					['sunday', 'Domingo'],
				] as Array<[Day, string]>
			).map(([day, label]) => {
				const isActive = form.watch(`${day}.is_available`);
				return (
					<Stack key={day} className="w-full gap-3">
						<div className="flex items-center justify-between">
							<Controller
								control={form.control}
								name={`${day}.is_available` as const}
								render={({ field }) => (
									<Input.Switch
										isSelected={field.value}
										onValueChange={field.onChange}
									>
										{label}
									</Input.Switch>
								)}
							/>
							{isActive && (
								<Input.Switch
									isSelected={isFullDay(day)}
									onValueChange={(enabled) => setFullDay(day, enabled)}
									size="sm"
								>
									Dia inteiro?
								</Input.Switch>
							)}
						</div>
						<Stack direction="row" className="w-full gap-4">
							<Controller
								control={form.control}
								name={`${day}.start` as const}
								render={({ field, fieldState }) => (
									<Input.Time
										label="Início"
										value={field.value ? parseTime(field.value) : null}
										isRequired={isActive}
										isDisabled={!isActive}
										onChange={(t) =>
											field.onChange(t ? t.toString().slice(0, 5) : '')
										}
										isInvalid={!!fieldState.error}
										errorMessage={fieldState.error?.message}
									/>
								)}
							/>
							<Controller
								control={form.control}
								name={`${day}.end` as const}
								render={({ field, fieldState }) => (
									<Input.Time
										label="Fim"
										isRequired={isActive}
										isDisabled={!isActive}
										value={field.value ? parseTime(field.value) : null}
										onChange={(t) =>
											field.onChange(t ? t.toString().slice(0, 5) : '')
										}
										isInvalid={!!fieldState.error}
										errorMessage={fieldState.error?.message}
									/>
								)}
							/>
						</Stack>
					</Stack>
				);
			})}
			<Button isLoading={updateProfile.isPending} type="submit">
				Salvar
			</Button>
		</Form>
	);
};
