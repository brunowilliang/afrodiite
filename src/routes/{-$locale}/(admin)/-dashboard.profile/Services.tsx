import { useEffect, useState } from 'react';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import type { ProfileData, profile } from '@/queries/profile';
import { cn } from '@/utils/cn';

interface Props {
	id: string;
	data?: ProfileData['services'];
	onSubmit: ReturnType<typeof profile.update.useMutation>;
}

const DATA_SERVICES = [
	{
		id: 1,
		label: 'Sexo anal com preservativo',
		description: '',
	},
	{
		id: 2,
		label: 'Sexo vaginal com preservativo',
		description: '',
	},
	{
		id: 3,
		label: 'Sexo oral com preservativo',
		description: '',
	},
	{
		id: 4,
		label: 'Beijo na boca',
		description: '',
	},
	{
		id: 5,
		label: 'Striptease',
		description: '',
	},
	{
		id: 6,
		label: 'Masturbação',
		description: '',
	},
	{
		id: 7,
		label: 'Massagem tradicional',
		description: '',
	},
	{
		id: 8,
		label: 'Massagem tântrica',
		description: '',
	},
	{
		id: 9,
		label: 'Sexo Virtual',
		description: '',
	},
	{
		id: 10,
		label: 'Acompanhante',
		description: '',
	},
	{
		id: 11,
		label: 'Viagem',
		description: '',
	},
	{
		id: 12,
		label: 'Sexo oral sem preservativo',
		description: '',
	},
	{
		id: 13,
		label: 'Dupla penetração',
		description: '',
	},
	{
		id: 14,
		label: 'Tripla penetração',
		description: '',
	},
	{
		id: 15,
		label: 'Dominação',
		description: '',
	},
	{
		id: 16,
		label: 'Uso de roupas de fantasia/uniformes',
		description: '',
	},
	{
		id: 17,
		label: 'Roleplay',
		description: '',
	},
	{
		id: 18,
		label: 'Penetração com acessórios sexuais',
		description: '',
	},
	{
		id: 19,
		label: 'Permite filmagem',
		description: '',
	},
	{
		id: 20,
		label: 'Beijo grego',
		description: '',
	},
	{
		id: 21,
		label: 'Sexo com voyeurismo/ser voyeur',
		description: '',
	},
	{
		id: 22,
		label: 'Podolatria',
		description: '',
	},
	{
		id: 23,
		label: 'Bondage',
		description: '',
	},
	{
		id: 24,
		label: 'Sadomasoquismo',
		description: '',
	},
	{
		id: 25,
		label: 'Fisting',
		description: '',
	},
	{
		id: 26,
		label: 'Facefuck',
		description: '',
	},
	{
		id: 27,
		label: 'Quirofilia',
		description: '',
	},
	{
		id: 28,
		label: 'Squirt',
		description: '',
	},
	{
		id: 29,
		label: 'Chuva dourada',
		description: '',
	},
	{
		id: 30,
		label: 'Chuva marrom',
		description: '',
	},
	{
		id: 31,
		label: 'Frampling',
		description: '',
	},
];

export const ServicesTab = ({ id, data, onSubmit }: Props) => {
	const [selected, setSelected] = useState<Set<number>>(new Set());
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const map = data ?? {};
		setSelected(
			new Set(
				Object.entries(map)
					.filter(([, v]) => !!v)
					.map(([k]) => Number(k)),
			),
		);
	}, [data]);

	const toggle = (id: number) => {
		setSelected((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const handleSave = async () => {
		setSaving(true);
		const services = Object.fromEntries(
			Array.from(selected).map((id) => [String(id), true]),
		);
		try {
			await onSubmit.mutateAsync({ id, services });
		} finally {
			setSaving(false);
		}
	};

	return (
		<Stack className="gap-5">
			<Badge>
				<Badge.Text>Serviços oferecidos</Badge.Text>
			</Badge>

			<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
				{DATA_SERVICES.map((svc) => {
					const active = selected.has(svc.id);
					return (
						<Card
							key={svc.id}
							clickable
							onClick={() => toggle(svc.id)}
							title={svc.description}
							className={cn(
								active && 'border-primary bg-primary',
								!active && 'text-text-secondary',
							)}
						>
							<Text>{svc.label}</Text>
						</Card>
					);
				})}
			</div>
			<Button type="button" disabled={saving} onClick={handleSave}>
				<Button.Text>{saving ? 'Salvando...' : 'Salvar'}</Button.Text>
			</Button>
		</Stack>
	);
};
