'use client';

import { Card, Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseTime } from '@internationalized/date';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Day } from '@/api/utils/schemas/escort-core';
import { createDefaults, DayEnum } from '@/api/utils/schemas/escort-core';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { Stack } from '@/components/core/Stack';
import { toast } from '@/components/core/Toast';
import { useProfile } from '@/hooks/useProfile';
import { Badge } from '../../components/Badge';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const HorariosSchema = z
	.object(
		Object.fromEntries(
			(DayEnum.options as readonly Day[]).map((day) => [
				day,
				z.object({
					is_available: z.boolean(),
					start: z
						.string()
						.regex(timeRegex, 'Formato inválido. Use HH:MM (ex: 14:30)'),
					end: z
						.string()
						.regex(timeRegex, 'Formato inválido. Use HH:MM (ex: 14:30)'),
				}),
			]),
		) as Record<Day, z.ZodObject<any>>,
	)
	.superRefine((val, ctx) => {
		const anyActive = Object.values(val).some((v: any) => !!v.is_available);
		if (!anyActive) {
			const firstDay = (DayEnum.options as readonly Day[])[0];
			ctx.addIssue({
				code: 'custom',
				message: 'Ative pelo menos um dia para salvar os horários.',
				path: [firstDay, 'is_available'],
			});
		}
	});

export const Horarios = () => {
	const { profile, updateProfile, isUpdating } = useProfile();

	const handleSubmit = async () => {
		const values = form.getValues();
		const office_hours = (DayEnum.options as readonly Day[]).map((day) => ({
			day,
			is_available: values[day].is_available as boolean,
			start: values[day].start as string,
			end: values[day].end as string,
		}));

		await updateProfile({ office_hours });
	};

	const form = useForm({
		resolver: zodResolver(HorariosSchema) as any,
		mode: 'onChange',
		defaultValues: profile?.office_hours?.length
			? Object.fromEntries(
					profile.office_hours.map(({ day, is_available, start, end }) => [
						day,
						{ is_available, start, end },
					]),
				)
			: Object.fromEntries(
					createDefaults
						.officeHours()
						.map(({ day, is_available, start, end }) => [
							day,
							{ is_available, start, end },
						]),
				),
	});

	const onInvalid = () => {
		const anySelected = (DayEnum.options as readonly Day[]).some((d) =>
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
		<Stack className="gap-5">
			<Badge icon="ClockSquare" label="Horários" />
			<Form
				validationBehavior="aria"
				onSubmit={form.handleSubmit(handleSubmit, onInvalid)}
				className="flex w-full flex-col gap-5"
			>
				<Stack className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
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
							<Card key={day} className="w-full gap-3 p-4 last:md:col-span-2">
								<Badge icon="Stars" label={label} />
								<Stack
									direction="row"
									className="centered w-full justify-between"
								>
									<Controller
										control={form.control}
										name={`${day}.is_available` as const}
										render={({ field }) => (
											<Input.Switch
												isSelected={field.value}
												onValueChange={field.onChange}
											>
												{isActive ? 'Disponível' : 'Indisponível'}
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
								</Stack>
								<Stack direction="row" className="w-full gap-4">
									<Controller
										control={form.control}
										name={`${day}.start` as const}
										render={({ field, fieldState }) => (
											<Input.Time
												label="Início"
												variant="faded"
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
												variant="faded"
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
							</Card>
						);
					})}
				</Stack>
				<Button size="md" isLoading={isUpdating} type="submit">
					Salvar
				</Button>
			</Form>
		</Stack>
	);
};
