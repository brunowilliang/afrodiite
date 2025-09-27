import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/orpc';
import { Badge } from '../components/Badge';
import PricesForm from '../components/PricesForm';

export default async function Precos() {
	const profile = (await api.orpc.profile.get()) as IProfile.Select | undefined;

	return (
		<Stack className="gap-5">
			<Badge icon="MoneyBag" label="Preços" />
			<PricesForm profile={profile} />
		</Stack>
	);
}
