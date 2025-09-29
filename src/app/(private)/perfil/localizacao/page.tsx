import { Stack } from '@/components/core/Stack';
import { getProfile } from '@/lib/server/profile-cache';
import { Badge } from '../../components/Badge';
import { Location } from '../../components/Location';

export default async function Localizacao() {
	const profile = await getProfile();

	return (
		<Stack className="gap-5">
			<Badge icon="Location" label="Localização" />
			<Location profile={profile} />
		</Stack>
	);
}
