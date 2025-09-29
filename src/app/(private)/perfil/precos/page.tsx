import { Stack } from '@/components/core/Stack';
import { getProfile } from '@/lib/server/profile-cache';
import { Badge } from '../../components/Badge';
import { Prices } from '../../components/Prices';

export default async function Precos() {
	const profile = await getProfile();

	return (
		<Stack className="gap-5">
			<Badge icon="MoneyBag" label="Preços" />
			<Prices profile={profile} />
		</Stack>
	);
}
