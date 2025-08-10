import { useForm } from 'react-hook-form';
import type { Prices } from '@/api/db/schemas/escort';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { FormInput } from '@/components/core/Inputs/FormInput';
import { Stack } from '@/components/core/Stack';
import type { profile } from '@/queries/profile';
import type { EscortProfile } from '@/schemas/forms/profile';

interface Props {
	id: string;
	data?: EscortProfile['prices'];
	onSubmit: ReturnType<typeof profile.update.useMutation>;
}

const dayDefs: { key: keyof Prices; label: string }[] = [
	{ key: '30m', label: '30m' },
	{ key: '1h', label: '1h' },
	{ key: '2h', label: '2h' },
	{ key: '4h', label: '4h' },
	{ key: 'overnight', label: 'Pernoite' },
	{ key: 'daily', label: 'Diária' },
	{ key: 'travel_daily', label: 'Diária (Viagem)' },
];

export const PricesTab = ({ id, data, onSubmit }: Props) => {
	const form = useForm({
		mode: 'onChange',
		values: { prices: data?.prices },
	});

	const handleSubmit = async (values: typeof data) => {
		await onSubmit.mutateAsync({
			id,
			prices: values?.prices,
		});
	};

	return (
		<Stack className="gap-5">
			<Badge>
				<Badge.Text>Preços</Badge.Text>
			</Badge>

			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Stack className="gap-4">
					<Stack className="gap-3">
						{dayDefs.map(({ key, label }) => {
							const isAvailable = form.watch(`prices.${key}.is_available`);
							return (
								<Stack key={key} direction="row" className="centered gap-4">
									<FormInput
										control={form.control}
										name={`prices.${key}.is_available`}
										type="checkbox"
										className="size-10"
									/>
									<FormInput
										control={form.control}
										name={`prices.${key}.amount`}
										label={`Preço por ${label}`}
										iconName="Euro"
										type="number"
										className="w-full"
										placeholder="0"
										disabled={isAvailable === false}
									/>
								</Stack>
							);
						})}
					</Stack>

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
