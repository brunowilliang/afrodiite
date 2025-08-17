import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseTime } from '@internationalized/date';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import {
	DAYS,
	type Day,
	DEFAULT_OFFICE_HOURS,
} from '@/api/utils/defaults/escort';
import { Stack } from '@/components/core/Stack';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
import { api } from '@/lib/api';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const daySchema = z
	.object({
		is_available: z.boolean(),
		start: z.string().regex(timeRegex, {
			error: 'Hora de início deve estar no formato HH:MM',
		}),
		end: z.string().regex(timeRegex, {
			error: 'Hora de fim deve estar no formato HH:MM',
		}),
	})
	.superRefine((val, ctx) => {
		if (!val.is_available) return; // não valida se o dia não estiver ativo
		try {
			const s = parseTime(val.start);
			const e = parseTime(val.end);
			const startsBeforeEnd =
				s.hour < e.hour || (s.hour === e.hour && s.minute < e.minute);
			if (!startsBeforeEnd) {
				ctx.addIssue({
					code: 'custom',
					message: 'Hora de início deve ser menor que a hora de fim',
					path: ['end'],
				});
			}
		} catch {
			// parse error será pego pelos regex acima
		}
	});

const schema = z.object(
	Object.fromEntries(
		(DAYS as readonly Day[]).map((d) => [d, daySchema]),
	) as Record<Day, typeof daySchema>,
);

export const OfficeHoursTab = () => {
	const router = useRouter();
	const { session, profile } = useRouteContext({ from: '/{-$locale}' });

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	const handleSubmit = (values: z.infer<typeof schema>) => {
		const office_hours = (DAYS as readonly Day[]).map((day) => ({
			day,
			...values[day],
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
		defaultValues: (profile?.office_hours?.length
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
				)) as z.infer<typeof schema>,
	});

	return (
		<Form
			validationBehavior="aria"
			onSubmit={form.handleSubmit(handleSubmit)}
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
						<Stack direction="row" className="w-full gap-4">
							<Controller
								control={form.control}
								name={`${day}.start` as const}
								rules={{ required: isActive }}
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
								rules={{ required: isActive }}
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
