import { Stack } from '@/components/core/Stack';
import { Badge } from '../../components/Badge';
import { Reviews } from '.';

export default function Avaliacoes() {
	return (
		<Stack className="gap-5">
			<Badge icon="Reviews" label="Avaliações" />
			<Reviews />
		</Stack>
	);
}
