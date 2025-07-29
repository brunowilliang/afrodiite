import { createFileRoute, Link } from '@tanstack/react-router';
import { Carousel } from '@/components/Carousel';
import { Badge } from '@/components/core/Badge';
import { Input } from '@/components/core/Input';
import { Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';

export const Route = createFileRoute('/(public)/')({
	component: Home,
});

function Home() {
	return (
		<Stack container className="mt-20 gap-12 overflow-hidden py-16">
			<Stack className="gap-4">
				<Text as="h3" weight="normal" align="center">
					Encontre as acompanhantes de luxo mais exclusivas de
					<br />
					Portugal
				</Text>
				<Text
					as="p"
					weight="light"
					align="center"
					className="text-text-secondary"
				>
					Explore Agora!
				</Text>
				<Input placeholder="Pesquise sua modelo" />
				<Text align="center" className="text-text-secondary">
					ou selecione o local
				</Text>

				<Link to="/escorts" viewTransition>
					<Input placeholder="Selecione o local" clickable />
				</Link>
			</Stack>

			<Stack className="gap-4">
				<Badge>
					<Badge.Text>Novidades Da Semana</Badge.Text>
				</Badge>
				<Carousel />
			</Stack>

			<Stack className="gap-4">
				<Badge>
					<Badge.Text>As Mais Populares</Badge.Text>
				</Badge>
				<Carousel />
			</Stack>
		</Stack>
	);
}
