import { Stack } from '@/components/core/Stack';
import { Badge } from '../../components/Badge';
import { Services } from '.';

export default function Servicos() {
	return (
		<Stack className="gap-5">
			<Badge icon="Services" label="Serviços" />
			<Services />
		</Stack>
	);
}
