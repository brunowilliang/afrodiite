import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/orpc';
import { Badge } from '../components/Badge';
import SchedulesForm from '../components/SchedulesForm';

export default async function Horarios() {
	const profile = (await api.orpc.profile.get()) as IProfile.Select | undefined;

	return (
		<Stack className="gap-5">
			<Badge icon="ClockSquare" label="Horários" />
			<SchedulesForm profile={profile} />
		</Stack>
	);
}
