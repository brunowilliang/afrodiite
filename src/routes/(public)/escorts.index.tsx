import { createFileRoute } from '@tanstack/react-router';
import { Carousel } from '@/components/Carousel';
import { BackButton } from '@/components/core/BackButton';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { EscortCard } from '@/components/EscortCard';

export const Route = createFileRoute('/(public)/escorts/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Stack container className="mt-[86px] gap-12 overflow-hidden py-4">
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

			<Stack className="gap-4">
				<Badge>
					<Badge.Text>Destaques da semana</Badge.Text>
				</Badge>
				<Carousel />
			</Stack>

			<Stack className="gap-4">
				<Badge>
					<Badge.Text>A nossa seleção</Badge.Text>
				</Badge>
				<Carousel />
			</Stack>

			<Stack className="grid grid-cols-2 gap-3">
				<Badge className="col-span-2">
					<Badge.Text>Novidades</Badge.Text>
				</Badge>
				<EscortCard />
				<EscortCard />
				<EscortCard />
				<EscortCard />
				<EscortCard />
				<EscortCard />
				<EscortCard />
				<EscortCard />
			</Stack>

			<Stack className="grid grid-cols-2 gap-3">
				<Badge className="col-span-2">
					<Badge.Text>Todas as Acompanhantes</Badge.Text>
				</Badge>
				<EscortCard />
				<EscortCard />
				<EscortCard />
				<EscortCard />
				<EscortCard />
				<EscortCard />
				<EscortCard />
				<EscortCard />
			</Stack>
		</Stack>
	);
}
