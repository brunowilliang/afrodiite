import { createFileRoute, notFound } from '@tanstack/react-router';
import { Badge } from '@/components/core/Badge';
import { Card } from '@/components/core/Card';
import { Navigation } from '@/components/core/Navigation';
import { Container, Stack } from '@/components/core/Stack';
import { EscortCard } from '@/components/escorts/Card';
import type { EscortParams } from '@/schemas/routes/escort';
import { NavigationMenu } from '@/utils/data';

export const Route = createFileRoute('/{-$locale}/(public)/escorts/$country/')({
	component: RouteComponent,
	beforeLoad: ({ params }) => {
		const { country } = params as EscortParams;

		if (country !== 'portugal') {
			throw notFound();
		}
	},
});

function RouteComponent() {
	return (
		<Container hasHeader>
			<Stack className="grid grid-cols-1 gap-4 lg:grid-cols-12">
				<div className="col-span-3 hidden lg:block">
					<Card className="gap-4">
						<Badge>
							<Badge.Text>Regiões</Badge.Text>
						</Badge>
						<Navigation>
							{NavigationMenu.map((item) => (
								<Navigation.Item key={item.id} label={item.name}>
									<Navigation.SubMenu>
										{item.cities.map((city) => (
											<Navigation.SubMenu.Item
												key={city.id}
												label={city.name}
												href={city.href}
												badge={city.badge}
											/>
										))}
									</Navigation.SubMenu>
								</Navigation.Item>
							))}
						</Navigation>
					</Card>
				</div>
				<div className="col-span-9">
					<Stack className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3">
						{Array.from({ length: 20 }).map((_, index) => (
							<EscortCard key={index} />
						))}
					</Stack>
				</div>
			</Stack>
		</Container>
	);
}
