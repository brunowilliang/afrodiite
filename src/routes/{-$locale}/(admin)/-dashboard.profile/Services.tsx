import { Button, Checkbox } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ProfileUpdate } from '@/api/utils/types/escort';
import { Badge } from '@/components/core/Badge';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/api';

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

export const ServicesTab = () => {
	const router = useRouter();
	const { session, profile } = useRouteContext({ from: '/{-$locale}' });

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	const handleSubmit = (values: ProfileUpdate) => {
		updateProfile.mutateAsync(
			{
				id: session?.user.id,
				...values,
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

	return (
		<Stack className="gap-5">
			<Badge>
				<Badge.Text>Serviços oferecidos</Badge.Text>
			</Badge>

			<Stack className="w-full">
				{DATA_SERVICES.map((svc) => (
					<Checkbox key={svc.id} size="md">
						{svc.label}
					</Checkbox>
				))}
			</Stack>

			<Button color="primary" size="md">
				Salvar
			</Button>
		</Stack>
	);
};
