import { Stack } from '@/components/core/Stack';
import { getProfile } from '@/lib/server/profile-cache';
import { Badge } from '../../components/Badge';
import { Schedules } from '../../components/Schedules';

export default async function Horarios() {
	const profile = await getProfile();

	return (
		<Stack className="gap-5">
			<Badge icon="ClockSquare" label="Horários" />
			<Schedules profile={profile} />
		</Stack>
	);
}
