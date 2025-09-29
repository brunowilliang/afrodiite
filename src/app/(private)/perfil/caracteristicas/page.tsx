import { Stack } from '@/components/core/Stack';
import { getProfile } from '@/lib/server/profile-cache';
import { Badge } from '../../components/Badge';
import { Characteristics } from '../../components/Characteristics';

export default async function Caracteristicas() {
	const profile = await getProfile();

	return (
		<Stack className="gap-5">
			<Badge icon="Diamond" label="Características" />
			<Characteristics profile={profile} />
		</Stack>
	);
}
