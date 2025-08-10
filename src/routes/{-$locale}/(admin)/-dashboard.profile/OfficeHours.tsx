import { useForm } from 'react-hook-form';
import type { OfficeHours } from '@/api/db/schemas/escort';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { FormInput } from '@/components/core/Inputs/FormInput';
import { Stack } from '@/components/core/Stack';
import type { profile } from '@/queries/profile';
import type { EscortProfile } from '@/schemas/forms/profile';

interface Props {
	id: string;
	data?: EscortProfile['office_hours'];
	onSubmit: ReturnType<typeof profile.update.useMutation>;
}

const dayDefs: { key: keyof OfficeHours; label: string }[] = [
	{ key: 'monday', label: 'Segunda-feira' },
	{ key: 'tuesday', label: 'Terça-feira' },
	{ key: 'wednesday', label: 'Quarta-feira' },
	{ key: 'thursday', label: 'Quinta-feira' },
	{ key: 'friday', label: 'Sexta-feira' },
	{ key: 'saturday', label: 'Sábado' },
	{ key: 'sunday', label: 'Domingo' },
];

export const OfficeHoursTab = ({ id, data, onSubmit }: Props) => {
	const form = useForm({
		mode: 'onChange',
		values: { office_hours: data?.office_hours },
	});

	const handleSubmit = async (values: typeof data) => {
		await onSubmit.mutateAsync({
			id,
			office_hours: values?.office_hours,
		});
	};

	return (
		<Stack className="gap-5">
			<Badge>
				<Badge.Text>Horários de trabalho</Badge.Text>
			</Badge>

			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Stack className="gap-4">
					{dayDefs.map(({ key, label }) => {
						const isAvailable = form.watch(`office_hours.${key}.is_available`);
						return (
							<Stack key={key} className="gap-3">
								<Badge>
									<Badge.Text>{label}</Badge.Text>
								</Badge>

								<Stack direction="row" className="centered gap-4">
									<FormInput
										control={form.control}
										name={`office_hours.${key}.is_available`}
										type="checkbox"
										className="size-10"
									/>
									<FormInput
										control={form.control}
										name={`office_hours.${key}.start`}
										label="Inicio"
										iconName="Clock"
										type="time"
										className="w-full"
										placeholder="00:00"
										disabled={isAvailable === false}
									/>

									<FormInput
										control={form.control}
										name={`office_hours.${key}.end`}
										label="Fim"
										iconName="Clock"
										type="time"
										className="w-full"
										placeholder="00:00"
										disabled={isAvailable === false}
									/>
								</Stack>
							</Stack>
						);
					})}

					<Button type="submit" disabled={form.formState.isSubmitting}>
						<Button.Text>
							{form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
						</Button.Text>
					</Button>
				</Stack>
			</form>
		</Stack>
	);
};
