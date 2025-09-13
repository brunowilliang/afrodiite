import { Card, Chip } from '@heroui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
	createFileRoute,
	notFound,
	redirect,
	useCanGoBack,
	useRouter,
} from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { Icon } from '@/components/core/Icon';
import { ImageCarousel } from '@/components/core/ImageCarousel';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { Button } from '@/components/heroui/Button';
import { Modal, ModalRef } from '@/components/heroui/Modal';
import { useAnalytics } from '@/hooks/useAnalytics';
import { api } from '@/lib/api';
import { AccordionPrice } from './-_default.escort.$public_id.{-$slug}/AccordionPrice';
import { CharacteristicsCard } from './-_default.escort.$public_id.{-$slug}/CharacteristicsCard';
import { OfficeHoursCard } from './-_default.escort.$public_id.{-$slug}/OfficeHoursCard';
import { PricesCard } from './-_default.escort.$public_id.{-$slug}/PricesCard';
import { ServicesCard } from './-_default.escort.$public_id.{-$slug}/ServicesCard';
import { TextCard } from './-_default.escort.$public_id.{-$slug}/TextCard';

export const Route = createFileRoute(
	'/{-$locale}/(public)/_default/escort/$public_id/{-$slug}',
)({
	loader: async ({ context: { queryClient }, params }) => {
		const { public_id, slug } = params;

		const profile = await api.client.escorts.detail({ public_id });

		if (!profile) throw notFound();

		if (!slug || profile.slug !== slug) {
			throw redirect({
				to: '/{-$locale}/escort/$public_id/{-$slug}',
				params: {
					public_id,
					slug: profile.slug ?? '',
				},
				statusCode: 308,
				replace: true,
				throw: true,
			});
		}

		await queryClient.ensureQueryData(
			api.queries.escorts.detail.queryOptions({ input: { public_id } }),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();
	const canGoBack = useCanGoBack();
	const modalRef = useRef<ModalRef>(null);
	const [modalService, setModalService] = useState<{
		label: string;
		description: string;
	} | null>(null);

	const { public_id } = Route.useParams();

	// ✅ Analytics - auto-track page view + trackEvent

	const { data: profile } = useSuspenseQuery(
		api.queries.escorts.detail.queryOptions({ input: { public_id } }),
	);

	if (!profile) throw notFound();

	const { trackEvent } = useAnalytics(profile.id);

	const gallery = profile.gallery ?? [];

	const handleGoBack = () => {
		if (canGoBack) {
			router.history.back();
		} else {
			router.history.push('/');
		}
	};

	return (
		<Container>
			<Stack direction="row" className="justify-start">
				<Button
					variant="light"
					color="primary"
					size="md"
					onPress={handleGoBack}
				>
					<Icon
						name="ArrowLeft"
						variant="stroke"
						size="20"
						className="-mr-1 -ml-1"
					/>
					Voltar
				</Button>
			</Stack>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
				<div className="col-span-full space-y-4 lg:col-span-8">
					<Card className="gap-1 p-2">
						<ImageCarousel
							images={gallery}
							drag
							openPreview
							width="85%"
							gap="2"
							dotSize="medium"
						/>
						<Card className="gap-4 p-5 px-3" shadow="none">
							<Chip color="primary" variant="flat" radius="sm">
								Acompanhante
							</Chip>
							<Text as="h2" weight="bold">
								{profile.artist_name}
							</Text>
						</Card>
					</Card>

					<TextCard title="Sobre Mim" text={profile.description ?? ''} />
					<CharacteristicsCard characteristics={profile.characteristics} />

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<OfficeHoursCard office_hours={profile.office_hours} />
						<PricesCard prices={profile.prices} />
					</div>

					<ServicesCard
						services={profile.services}
						onServiceClick={(service) => {
							modalRef.current?.open();
							setModalService(service);
						}}
					/>
				</div>
				<div className="col-span-full lg:col-span-4">
					<Stack className="hidden gap-4 lg:sticky lg:top-20 lg:flex">
						<AccordionPrice
							variant="web"
							profile={profile}
							trackEvent={trackEvent}
						/>

						<Card className="gap-4 p-5">
							{[
								'Acompanhante verificada',
								'Contato Seguro',
								'Não possui penalidades',
							].map((label, index) => (
								<Stack
									key={index}
									direction="row"
									className="items-center justify-start gap-2"
								>
									<Icon
										name="Check"
										variant="bulk"
										size="24"
										className="text-foreground"
									/>
									<Text weight="normal">{label}</Text>
								</Stack>
							))}

							<Button
								variant="light"
								color="danger"
								size="md"
								className="w-full"
							>
								<Icon name="Anonymous" variant="bulk" size="24" />
								Denunciar perfil anonimamente
							</Button>
						</Card>
					</Stack>
				</div>
			</div>

			{/* Accordion de preços fixo para mobile */}
			<AccordionPrice
				variant="mobile"
				profile={profile}
				trackEvent={trackEvent}
			/>

			{/* Modal de serviços */}
			<Modal ref={modalRef} size="xl" placement="bottom-center">
				<Modal.Content>
					<Modal.Header className="px-6 pt-5 pb-3 text-default-700">
						{modalService?.label}
					</Modal.Header>
					<Modal.Body className="px-6 pt-3 pb-5">
						<Text align="left" as="p" className="text-default-600">
							{modalService?.description}
						</Text>
					</Modal.Body>
				</Modal.Content>
			</Modal>
		</Container>
	);
}
