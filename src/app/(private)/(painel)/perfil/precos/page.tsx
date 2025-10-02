import { Stack } from '@/components/core/Stack';
import { Badge } from '../../components/Badge';
import { Prices } from '.';

export default function Precos() {
	return (
		<Stack className="gap-5">
			<Badge icon="MoneyBag" label="Preços" />
			<Prices />
		</Stack>
	);
}
