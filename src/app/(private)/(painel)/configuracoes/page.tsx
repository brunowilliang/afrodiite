import { Stack } from '@/components/core/Stack';
import { Badge } from '../components/Badge';
import { ConfiguracoesIndex } from '.';

export default function ConfiguracoesPage() {
	return (
		<Stack className="gap-5">
			<Badge icon="Settings" label="Configurações" />
			<ConfiguracoesIndex />
		</Stack>
	);
}
