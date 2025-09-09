import { Accordion, AccordionItem, Card, Chip } from '@heroui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
	createFileRoute,
	notFound,
	redirect,
	useCanGoBack,
	useRouter,
} from '@tanstack/react-router';
import type {
	Characteristics,
	OfficeHour,
	Price,
} from '@/api/utils/schemas/escort-core';
import { Icon } from '@/components/core/Icon';
import { ImageCarousel } from '@/components/core/ImageCarousel';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { Button } from '@/components/heroui/Button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { api } from '@/lib/api';
import { DATA_SERVICES } from '@/utils/services';

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

	const { public_id } = Route.useParams();

	// ✅ Analytics - auto-track page view + trackEvent

	const { data: profile } = useSuspenseQuery(
		api.queries.escorts.detail.queryOptions({ input: { public_id } }),
	);

	if (!profile) throw notFound();

	const { trackEvent } = useAnalytics(profile.id);

	const caracteristicsTranslations: Record<keyof Characteristics, string> = {
		gender: 'Gênero',
		age: 'Idade',
		height: 'Altura',
		weight: 'Peso',
		hair_color: 'Cor do cabelo',
		eye_color: 'Cor dos olhos',
		sexual_preference: 'Preferência sexual',
		ethnicity: 'Etnia',
		silicone: 'Silicone',
		tattoos: 'Tatuagens',
		piercings: 'Piercings',
		smoker: 'Fumante',
		languages: 'Idiomas',
	};

	const officeHourTranslations: Record<OfficeHour['day'], string> = {
		monday: 'Segunda-feira:',
		tuesday: 'Terça-feira:',
		wednesday: 'Quarta-feira:',
		thursday: 'Quinta-feira:',
		friday: 'Sexta-feira:',
		saturday: 'Sábado:',
		sunday: 'Domingo:',
	};

	const priceTranslations: Record<Price['slot'], string> = {
		'30m': '30 minutos:',
		'1h': '1 hora:',
		'2h': '2 horas:',
		'4h': '4 horas:',
		daily: 'Diária:',
		overnight: 'Pernoite:',
		travel: 'Diária de viagem:',
		outcall: 'Deslocação:',
	};

	const serviceTranslations: Record<
		(typeof DATA_SERVICES)[number]['id'],
		string
	> = DATA_SERVICES.reduce(
		(acc, service) => {
			acc[service.id] = service.label;
			return acc;
		},
		{} as Record<(typeof DATA_SERVICES)[number]['id'], string>,
	);

	const gallery = profile.gallery ?? [];

	const price = profile.prices?.find((price) => price.slot === '1h');
	const priceLabel = price?.amount ? `€${price.amount} / 1h` : 'Consultar';

	const handleGoBack = () => {
		if (canGoBack) {
			router.history.back();
		} else {
			router.history.push('/');
		}
	};

	return (
		<Container>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
				<div className="col-span-8 space-y-4">
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
					<Card className="gap-1 p-1">
						<ImageCarousel
							images={gallery}
							drag
							openPreview
							width="85%"
							gap="2"
							dotSize="medium"
						/>
						<Card className="gap-4 p-5" shadow="none">
							<Chip color="primary" variant="flat" radius="sm">
								Acompanhante
							</Chip>
							<Text as="h2" weight="bold">
								{profile.artist_name}
							</Text>
						</Card>
					</Card>

					<Card className="gap-4 p-5">
						<Chip color="primary" variant="flat" radius="sm">
							Sobre Mim
						</Chip>
						<Text weight="normal">
							{profile.description ?? 'Sem descrição.'}
						</Text>
					</Card>

					<Card className="gap-4 p-5">
						<Chip color="primary" variant="flat" radius="sm">
							Características
						</Chip>
						{Object.entries(profile.characteristics ?? {}).map(
							([key, value]) => (
								<Stack
									key={key}
									direction="row"
									className="gap-1 border-divider/40 border-b py-1 last:border-b-0"
								>
									<Text weight="bold">
										{caracteristicsTranslations[key as keyof Characteristics]}:
									</Text>
									<Text weight="light">
										{typeof value === 'boolean'
											? value
												? 'Sim'
												: 'Não'
											: value}
									</Text>
								</Stack>
							),
						)}
					</Card>

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<Card className="gap-4 p-5">
							<Chip color="primary" variant="flat" radius="sm">
								Horário de expediente
							</Chip>
							{(profile.office_hours ?? []).map((hour) => (
								<Stack
									key={hour.day}
									direction="row"
									className="gap-1 border-divider/40 border-b py-1 last:border-b-0"
								>
									<Text weight="bold">{officeHourTranslations[hour.day]}</Text>
									<Text weight="light">
										{hour.start} - {hour.end}
									</Text>
								</Stack>
							))}
						</Card>

						<Card className="gap-4 p-5">
							<Chip color="primary" variant="flat" radius="sm">
								Valores
							</Chip>
							{(profile.prices ?? []).map((price) => (
								<Stack
									key={price.slot}
									direction="row"
									className="gap-1 border-divider/40 border-b py-1 last:border-b-0"
								>
									<Text weight="bold">{priceTranslations[price.slot]}</Text>
									<Text weight="light">
										{price.is_available ? `€ ${price.amount}` : 'Não realiza'}
									</Text>
								</Stack>
							))}
						</Card>
					</div>

					<Card className="gap-4 p-5">
						<Chip color="primary" variant="flat" radius="sm">
							Serviços
						</Chip>
						{(profile.services ?? []).map((serviceId) => (
							<Stack
								key={serviceId}
								direction="row"
								className="gap-1 border-divider/40 border-b py-1 last:border-b-0"
							>
								<Text weight="normal">
									{
										serviceTranslations[
											serviceId as keyof typeof serviceTranslations
										]
									}
								</Text>
							</Stack>
						))}
					</Card>
				</div>
				<div className="col-span-4">
					<Stack className="gap-4 lg:sticky lg:top-20">
						<Card className="gap-0 p-5">
							<Chip color="primary" variant="flat" radius="sm">
								Preços
							</Chip>
							<Accordion>
								<AccordionItem
									key="prices"
									aria-label="Tabela de preços"
									indicator={
										<Icon name="ArrowLeft" variant="stroke" size="20" />
									}
									classNames={{ indicator: 'text-foreground' }}
									title={
										<Stack
											direction="row"
											className="w-full items-center justify-between"
										>
											<Text as="h2" weight="bold">
												{priceLabel}
											</Text>
										</Stack>
									}
								>
									{(profile.prices ?? []).map((price) => (
										<Stack
											key={price.slot}
											direction="row"
											className="justify-start gap-1 border-divider/40 border-b py-2 first:pt-0 last:border-b-0 last:pb-5"
										>
											<Text weight="bold">{priceTranslations[price.slot]}</Text>
											<Text weight="light">
												{price.is_available
													? `€ ${price.amount}`
													: 'Não realiza'}
											</Text>
										</Stack>
									))}
								</AccordionItem>
							</Accordion>

							<Stack direction="row" className="w-full gap-2">
								<Button
									className="w-full"
									onPress={() => trackEvent('phone_click')}
								>
									Telefone
								</Button>
								<Button
									className="w-full"
									onPress={() => trackEvent('whatsapp_click')}
								>
									WhatsApp
								</Button>
							</Stack>
						</Card>
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
		</Container>
	);
}
