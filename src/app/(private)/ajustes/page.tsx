import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/orpc';
import { Badge } from '../perfil/components/Badge';
import SettingsForm from './components/SettingsForm';

export default async function Ajustes() {
	const profile = (await api.orpc.profile.get()) as IProfile.Select | undefined;

	return (
		<Stack className="gap-5">
			<Badge icon="Settings" label="Ajustes" />
			<SettingsForm profile={profile} />
		</Stack>
	);
}
