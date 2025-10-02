import { Stack } from '@/components/core/Stack';
import { Badge } from '../components/Badge';
import SettingsForm from '.';

export default function Ajustes() {
	return (
		<Stack className="gap-5">
			<Badge icon="Settings" label="Ajustes" />
			<SettingsForm />
		</Stack>
	);
}
