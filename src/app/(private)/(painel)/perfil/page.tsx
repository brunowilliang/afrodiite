import { Stack } from '@/components/core/Stack';
import { Badge } from '../components/Badge';
import { Information } from '.';

export default function Profile() {
	return (
		<Stack className="gap-5">
			<Badge icon="Profile" label="Informações" />
			<Information />
		</Stack>
	);
}
