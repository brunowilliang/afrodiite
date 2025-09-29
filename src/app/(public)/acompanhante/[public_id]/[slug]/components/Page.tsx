'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { Icon } from '@/components/core/Icon';
import { ImageCarousel } from '@/components/core/ImageCarousel';
import { Modal, ModalRef } from '@/components/core/Modal';
import { Stack } from '@/components/core/Stack';
import { AccordionPrice } from './AccordionPrice';
import { CharacteristicsCard } from './CharacteristicsCard';
import { OfficeHoursCard } from './OfficeHoursCard';
import { PricesCard } from './PricesCard';
import { ReviewsWrapper } from './ReviewsWrapper';
import { ServicesCard } from './ServicesCard';
import { TextCard } from './TextCard';

type Props = {
	profile: IProfile.Select;
};

export const EscortPage = ({ profile }: Props) => {
	const modalServiceRef = useRef<ModalRef>(null);
	const router = useRouter();
	const [modalService, setModalService] = useState<{
		label: string;
		description: string;
	} | null>(null);

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
							images={profile.gallery ?? []}
							drag
							openPreview
							width="85%"
							gap="2"
							dotSize="medium"
						/>
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

					<ReviewsWrapper escort_id={profile.id} />
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
		</div>
	);
};
