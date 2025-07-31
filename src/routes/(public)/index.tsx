import { createFileRoute } from '@tanstack/react-router';
import { useRef } from 'react';
import { Carousel } from '@/components/Carousel';
import { CommandPalette } from '@/components/CommandPalette';
import { Badge } from '@/components/core/Badge';
import { Input } from '@/components/core/Input';
import type { ModalRef } from '@/components/core/Modal';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';

export const Route = createFileRoute('/(public)/')({
	component: Home,
});

function Home() {
	const modalRef = useRef<ModalRef>(null);

	return (
		<Container className="mt-20 gap-12 overflow-hidden py-16">
			<Stack className="centered mx-auto max-w-2xl gap-4 py-40">
				<Badge>
					<Badge.Text className="text-lg text-text-secondary md:text-xl">
						Explore Agora!
					</Badge.Text>
				</Badge>
				<Text
					as="h1"
					weight="bold"
					className="text-center text-3xl leading-tight md:text-4xl"
				>
					Encontre as acompanhantes de luxo mais exclusivas de Portugal
				</Text>

				<Input
					placeholder="Pesquise"
					clickable
					onClick={() => modalRef.current?.open()}
				/>
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

			<CommandPalette ref={modalRef} />
		</Container>
	);
}
