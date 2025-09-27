import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/orpc';
import { Badge } from '../components/Badge';
import LocationForm from '../components/LocationForm';

export default async function Localizacao() {
	const profile = (await api.orpc.profile.get()) as IProfile.Select | undefined;

	return (
		<Stack className="gap-5">
			<Badge icon="Location" label="Localização" />
			<LocationForm profile={profile} />
		</Stack>
	);
}
