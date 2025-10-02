import { Stack } from '@/components/core/Stack';
import { Badge } from '../../components/Badge';
import { Location } from '.';

export default function Localizacao() {
	return (
		<Stack className="gap-5">
			<Badge icon="Location" label="Localização" />
			<Location />
		</Stack>
	);
}
