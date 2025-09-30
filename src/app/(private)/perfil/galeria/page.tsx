import { Stack } from '@/components/core/Stack';
import { Badge } from '../../components/Badge';
import { Gallery } from '.';

export default function Galeria() {
	return (
		<Stack className="gap-5">
			<Badge icon="Gallery" label="Imagens" />
			<Gallery />
		</Stack>
	);
}
