import { Stack } from '@/components/core/Stack';
import { Badge } from '../../components/Badge';
import { Characteristics } from '.';

export default function Caracteristicas() {
	return (
		<Stack className="gap-5">
			<Badge icon="Diamond" label="Características" />
			<Characteristics />
		</Stack>
	);
}
