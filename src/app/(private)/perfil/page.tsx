import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/orpc';
import { Badge } from './components/Badge';
import InformationForm from './components/InformationForm';

export default async function Profile() {
	const profile = (await api.orpc.profile.get()) as IProfile.Select | undefined;

	return (
		<Stack className="gap-5">
			<Badge icon="Profile" label="Informações" />
			<InformationForm profile={profile} />
		</Stack>
	);
}
