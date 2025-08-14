import { createFileRoute } from '@tanstack/react-router';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Carousel } from '@/components/Carousel';
import { CommandPalette } from '@/components/CommandPalette';
import { Badge } from '@/components/core/Badge';
import { Input } from '@/components/core/Input';
import { Link } from '@/components/core/Link';
import type { ModalRef } from '@/components/core/Modal';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';

export const Route = createFileRoute('/{-$locale}/(public)/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { t } = useTranslation();
	const modalRef = useRef<ModalRef>(null);

	return (
		<Container className="mt-20 gap-12 overflow-hidden py-16">
			<Stack className="centered mx-auto max-w-2xl gap-4 py-40">
				<Link to="/{-$locale}/sign-in">
					<Text>Login</Text>
				</Link>
				<Badge>
					<Badge.Text className="text-lg text-text-secondary md:text-xl">
						home.badge
					</Badge.Text>
				</Badge>
				<Text
					as="h1"
					weight="bold"
					className="text-center text-3xl leading-tight md:text-4xl"
				>
					{t('home.title')}
				</Text>

				<Input
					placeholder={'home.searchPlaceholder'}
					clickable
					onClick={() => modalRef.current?.open()}
				/>
				<Link
					to="/{-$locale}/escorts/$country"
					params={{ country: 'portugal' }}
				>
					<Text>nav.escorts</Text>
				</Link>
			</Stack>

			<Stack className="gap-4">
				<Badge>
					<Badge.Text>home.weeklyNews</Badge.Text>
				</Badge>
				<Carousel />
			</Stack>

			<Stack className="gap-4">
				<Badge>
					<Badge.Text>home.mostPopular</Badge.Text>
				</Badge>
				<Carousel />
			</Stack>

			<CommandPalette ref={modalRef} />
		</Container>
	);
}
