import { Stack } from '@/components/core/Stack';
import { Badge } from '../../components/Badge';
import { Schedules } from '.';

export default function Horarios() {
	return (
		<Stack className="gap-5">
			<Badge icon="ClockSquare" label="Horários" />
			<Schedules />
		</Stack>
	);
}
