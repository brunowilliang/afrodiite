'use client';

import { useRouter } from 'next/navigation';
import { Stack } from '@/components/core/Stack';
import { Badge } from '../../components/Badge';
import { Reviews } from '.';

export default function Avaliacoes() {
	const router = useRouter();
	router.prefetch('/perfil/avaliacoes');

	return (
		<Stack className="gap-5">
			<Badge icon="Reviews" label="Avaliações" />
			<Reviews />
		</Stack>
	);
}
