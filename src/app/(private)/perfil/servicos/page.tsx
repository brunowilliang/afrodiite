import { Stack } from '@/components/core/Stack';
import { getProfile } from '@/lib/server/profile-cache';
import { Badge } from '../../components/Badge';
import { Services } from '../../components/Services';

export default async function Servicos() {
	const profile = await getProfile();

	return (
		<Stack className="gap-5">
			<Badge icon="Services" label="Serviços" />
			<Services profile={profile} />
		</Stack>
	);
}
