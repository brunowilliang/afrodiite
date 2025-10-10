'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { Icon } from '@/components/core/Icon';
import { ImageCarousel } from '@/components/core/ImageCarousel';
import { Modal, ModalRef } from '@/components/core/Modal';
import { Reviews } from '@/components/core/Reviews';
import { Stack } from '@/components/core/Stack';
import { useAnalytics } from '@/hooks/useAnalytics';
import { api } from '@/lib/orpc';
import { AccordionPrice } from './components/AccordionPrice';
import { CharacteristicsCard } from './components/CharacteristicsCard';
import { OfficeHoursCard } from './components/OfficeHoursCard';
import { PricesCard } from './components/PricesCard';
import { ServicesCard } from './components/ServicesCard';
import { TextCard } from './components/TextCard';

type Props = {
	publicId: string;
};

export const Acompanhante = ({ publicId }: Props) => {
	const { data: profile } = useSuspenseQuery(
		api.queries.escorts.detail.queryOptions({
			input: { public_id: publicId },
		}),
	);

	const { data: reviews } = useSuspenseQuery(
		api.queries.escorts.reviews.queryOptions({
			input: { public_id: publicId },
		}),
	);

	const modalServiceRef = useRef<ModalRef>(null);
	const router = useRouter();
	const [modalService, setModalService] = useState<{
		label: string;
		description: string;
	} | null>(null);

	const { trackEvent } = useAnalytics(profile);

	return (
		<div className="space-y-4">
			<Stack direction="row" className="justify-start">
				<Button
					variant="light"
					color="primary"
					size="md"
					onPress={() => router.back()}
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
							images={profile?.gallery ?? []}
							drag
							openPreview
							width="85%"
							gap="2"
							dotSize="medium"
						/>
						<Card className="gap-4 p-5 px-3" shadow="none">
							<Badge.Custom label="Acompanhante" size="md" className="py-5" />
							<h2 className="font-normal text-default-600 text-xl">
								{profile?.artist_name}
							</h2>
						</Card>
					</Card>

					<TextCard
						title="Sobre Mim"
						icon="Stars"
						text={profile?.description ?? ''}
					/>
					<CharacteristicsCard characteristics={profile?.characteristics} />

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<OfficeHoursCard office_hours={profile?.office_hours} />
						<PricesCard prices={profile?.prices} />
					</div>

					<ServicesCard
						services={profile?.services}
						onServiceClick={(service) => {
							modalServiceRef.current?.open();
							setModalService(service);
						}}
					/>

					<Reviews>
						<Reviews.Header
							escort_id={profile?.id ?? ''}
							public_id={profile?.public_id ?? 0}
						/>
						{reviews?.results.length === 0 && (
							<Card className="p-4">
								<span className="py-5 text-center text-default-600 text-small">
									Oops! Nenhuma avaliação encontrada...
								</span>
							</Card>
						)}
						{reviews?.results.map((review) => (
							<Reviews.Card
								key={review.id}
								reviewer_name={review.reviewer_name}
								created_at={review.created_at}
								rating={review.rating}
								title={review.title}
								comment={review.comment}
							/>
						))}
					</Reviews>
				</div>
				<div className="col-span-full lg:col-span-4">
					<Stack className="hidden gap-4 lg:sticky lg:top-25 lg:flex">
						<AccordionPrice
							variant="web"
							profile={profile ?? {}}
							handleWhatsAppClick={() => {
								const message = `Olá ${profile?.artist_name}, vi o seu anúncio no https://afrodiite.com e gostaria de saber mais informações!`;
								window.open(
									`https://wa.me/${profile?.whatsapp}?text=${encodeURIComponent(message)}`,
									'_blank',
								);
								trackEvent('whatsapp_click');
							}}
							handlePhoneClick={() => {
								window.open(`tel:${profile?.phone}`, '_blank');
								trackEvent('phone_click');
							}}
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
									<span className="font-normal text-default-600">{label}</span>
								</Stack>
							))}

							<Button
								variant="light"
								color="danger"
								size="md"
								className="w-full"
								isDisabled
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
				profile={profile ?? {}}
				handleWhatsAppClick={() => {
					const message = `Olá ${profile?.artist_name}, vi o seu anúncio no https://afrodiite.com e gostaria de saber mais informações!`;
					window.open(
						`https://wa.me/${profile?.whatsapp}?text=${encodeURIComponent(message)}`,
						'_blank',
					);
					trackEvent('whatsapp_click');
				}}
				handlePhoneClick={() => {
					window.open(`tel:${profile?.phone}`, '_blank');
					trackEvent('phone_click');
				}}
			/>

			{/* Modal de serviços */}
			<Modal ref={modalServiceRef} size="xl" placement="bottom-center">
				<Modal.Content>
					<Modal.Header className="px-6 pt-5 pb-3 text-default-700">
						{modalService?.label}
					</Modal.Header>
					<Modal.Body className="px-6 pt-3 pb-5">
						<span className="text-left text-default-600">
							{modalService?.description}
						</span>
					</Modal.Body>
				</Modal.Content>
			</Modal>
		</div>
	);
};
