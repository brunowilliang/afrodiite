import { createFileRoute } from '@tanstack/react-router';
import { BackButton } from '@/components/core/BackButton';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { Input } from '@/components/core/Input';
import { Navigation } from '@/components/core/Navigation';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { EscortCard } from '@/components/EscortCard';
import { NavigationMenu } from '@/utils/data';

export const Route = createFileRoute('/{-$locale}/(public)/escorts/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Container hasHeader>
			<Stack className="gap-4">
				<BackButton />

				<Stack direction="row" className="justify-between">
					<Stack className="gap-0">
						<Text as="p" weight="light" color="textSecondary">
							Acompanhantes em:
						</Text>
						<Text as="h2" weight="bold" color="textPrimary">
							Porto
						</Text>
					</Stack>

					<Button className="w-fit" variant="accent">
						<Button.Text>Filtros</Button.Text>
					</Button>
				</Stack>
				<Input placeholder="Pesquise sua modelo" />
			</Stack>

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
				<div className="col-span-9 space-y-4">
					<Stack className="grid grid-cols-2 gap-4 lg:grid-cols-3">
						{Array.from({ length: 20 }).map((_, index) => (
							<EscortCard key={index} />
						))}
					</Stack>
				</div>
			</Stack>
		</Container>
	)
}
