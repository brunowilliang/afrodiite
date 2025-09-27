import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/orpc';
import { Badge } from '../components/Badge';
import ServicesForm from '../components/ServicesForm';

export default async function Servicos() {
	const profile = (await api.orpc.profile.get()) as IProfile.Select | undefined;

	return (
		<Stack className="gap-5">
			<Badge icon="Services" label="Serviços" />
			<ServicesForm profile={profile} />
		</Stack>
	);
}
