import { Stack } from '@/components/core/Stack';
import { getProfile } from '@/lib/server/profile-cache';
import { Badge } from '../components/Badge';
import { Information } from '../components/Information';

export default async function Profile() {
	const profile = await getProfile();

	return (
		<Stack className="gap-5">
			<Badge icon="Profile" label="Informações" />
			<Information profile={profile} />
		</Stack>
	);
}
