import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/orpc';
import { Badge } from '../components/Badge';
import CharacteristicsForm from '../components/CharacteristicsForm';

export default async function Caracteristicas() {
	const profile = (await api.orpc.profile.get()) as IProfile.Select | undefined;

	return (
		<Stack className="gap-5">
			<Badge icon="Diamond" label="Características" />
			<CharacteristicsForm profile={profile} />
		</Stack>
	);
}
