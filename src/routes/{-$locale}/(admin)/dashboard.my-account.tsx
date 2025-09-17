import { createFileRoute } from '@tanstack/react-router';
import { Icon } from '@/components/core/Icon';
import { Stack } from '@/components/core/Stack';
import { Badge } from '@/components/heroui/Badge';

export const Route = createFileRoute(
	'/{-$locale}/(admin)/dashboard/my-account',
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Stack className="gap-5">
			<Badge>
				<Icon name="Stars" variant="bulk" size="20" />
				Minha conta
			</Badge>
		</Stack>
	);
}
