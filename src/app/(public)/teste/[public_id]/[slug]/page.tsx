'use client';

import { notFound } from 'next/navigation';
import { useRef, useState } from 'react';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { Icon } from '@/components/core/Icon';
import { Modal, ModalRef } from '@/components/core/Modal';
import { Reviews } from '@/components/core/Reviews';
import { Container, Stack } from '@/components/core/Stack';
import { api } from '@/lib/orpc';
import { AccordionPrice } from './components/AccordionPrice';
import { CharacteristicsCard } from './components/CharacteristicsCard';
import { OfficeHoursCard } from './components/OfficeHoursCard';
import { PricesCard } from './components/PricesCard';
import { ServicesCard } from './components/ServicesCard';
import { TextCard } from './components/TextCard';

export default async function EscortProfilePage(
	props: PageProps<'/acompanhantes/[public_id]/[slug]'>,
) {
	const { params } = props;
	const { public_id, slug } = await params;
	const publicId = Number(public_id);

	// Validate public_id is a number
	if (Number.isNaN(publicId)) {
		notFound();
	}

	try {
		// Fetch escort profile
		const profile = await api.orpc.escorts.detail({ public_id: publicId });

		// Check if profile exists and is visible
		if (!profile || !profile.is_visible || !profile.is_onboarding_complete) {
			notFound();
		}

		// Verify slug matches
		if (profile.slug !== slug) {
			notFound();
		}

		const modalServiceRef = useRef<ModalRef>(null);
		const [modalService, setModalService] = useState<{
			label: string;
			description: string;
		} | null>(null);

		return (
			<Container>
				<Stack direction="row" className="justify-start">
					<Button
						variant="light"
						color="primary"
						size="md"
						// onPress={handleGoBack}
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
							{/* <ImageCarousel
							images={gallery}
							drag
							openPreview
							width="85%"
							gap="2"
							dotSize="medium"
						/> */}
							<Card className="gap-4 p-5 px-3" shadow="none">
								<Badge color="primary" variant="flat" radius="sm">
									Acompanhante
								</Badge>
								<h2 className="font-bold">{profile.artist_name}</h2>
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
								modalServiceRef.current?.open();
								setModalService(service);
							}}
						/>

						<Reviews>
							<Reviews.Header escort_id={profile.id} />
							<Reviews.Card
								reviewer_name="John Doe"
								created_at={new Date()}
								rating={4}
								title="Review title"
								comment="Review content"
							/>
						</Reviews>
					</div>
					<div className="col-span-full lg:col-span-4">
						<Stack className="hidden gap-4 lg:sticky lg:top-20 lg:flex">
							<AccordionPrice
								variant="web"
								profile={profile}
								// trackEvent={trackEvent}
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
										<span className="font-normal">{label}</span>
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
					// trackEvent={trackEvent}
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
			</Container>
		);
	} catch (error) {
		console.error('Error fetching escort profile:', error);
		notFound();
	}
}
