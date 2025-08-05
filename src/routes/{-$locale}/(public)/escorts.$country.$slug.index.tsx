import { createFileRoute, notFound } from '@tanstack/react-router';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { Icon } from '@/components/core/Icon';
import { DATA_IMAGES, ImageCarousel } from '@/components/core/ImageCarousel';
import { Rating } from '@/components/core/Rating';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import type { EscortParams } from '@/schemas/routes/escort';
import {
	AvailableServices,
	AvailableWeekHours,
	Characteristics,
	Fetishes,
	Prices,
} from '@/utils/data';

export const Route = createFileRoute(
	'/{-$locale}/(public)/escorts/$country/$slug/',
)({
	beforeLoad: ({ params }) => {
		const { country } = params as EscortParams;

		if (country !== 'portugal') {
			throw notFound();
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Container hasHeader>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
				<div className="col-span-8 space-y-4">
					<Card className="gap-1 p-1">
						<ImageCarousel
							images={DATA_IMAGES}
							drag
							openPreview
							width="85%"
							gap="2"
							dotSize="medium"
						/>
						<Stack className="w-full items-start gap-3 p-3">
							<Stack className="items-start">
								<Text
									as="h5"
									weight="light"
									align="center"
									color="textSecondary"
								>
									Acompanhante
								</Text>
								<Stack direction="row" className="centered gap-2">
									<Text as="h3" weight="bold" align="center">
										Alycia Bittencourt
									</Text>
									<Icon name="Check" variant="bulk" size="32" color="primary" />
								</Stack>
							</Stack>
							<Stack
								direction="row"
								className="w-full items-center justify-between"
							>
								<Rating number={3.7} />
								<Text as="p" weight="light" align="center">
									578 Reviews
								</Text>
							</Stack>
						</Stack>
					</Card>

					<Card className="lg:hidden">
						<Stack
							direction="row"
							className="items-center justify-between gap-2"
						>
							<Text as="h3" weight="bold">
								€120/1 hora
							</Text>
						</Stack>
						<Stack direction="row" className="w-full gap-2">
							<Button className="w-full">
								<Button.Text>Telefone</Button.Text>
							</Button>
							<Button className="w-full">
								<Button.Text>WhatsApp</Button.Text>
							</Button>
						</Stack>
					</Card>

					<Card>
						<Badge>
							<Badge.Text>Sobre Mim</Badge.Text>
						</Badge>
						<Text as="p" weight="light">
							Oi, eu sou a Alycia Bittencourt, sua acompanhante dos sonhos,
							pronta para te levar ao delírio com meu charme e sensualidade. Com
							um sorriso provocante e um corpo que desperta desejos, sei como te
							envolver em momentos de pura safadeza e prazer. Adoro explorar
							fantasias, desde um jantar sedutor até encontros quentes e
							íntimos, sempre com muita entrega e discrição. Sou atenciosa,
							carinhosa e especialista em transformar seus desejos mais secretos
							em realidade, com um toque de malícia que vai te fazer perder o
							fôlego. Seja para uma noite de paixão, um evento com um toque
							especial ou uma aventura sem limites, estou aqui para te
							proporcionar experiências inesquecíveis, com toda a minha energia
							provocante e autenticidade.
						</Text>
					</Card>

					<Card>
						<Badge>
							<Badge.Text>Características</Badge.Text>
						</Badge>
						<Card.List>
							{Characteristics.map((characteristic) => (
								<Card.List.Item key={characteristic.label}>
									<Card.List.Item.Text weight="normal">
										{characteristic.label}:
									</Card.List.Item.Text>
									<Card.List.Item.Text weight="light">
										{characteristic.value}
									</Card.List.Item.Text>
								</Card.List.Item>
							))}
						</Card.List>
					</Card>

					<Card>
						<Badge>
							<Badge.Text>Horário de expediente</Badge.Text>
						</Badge>
						<Card.List>
							{AvailableWeekHours.map((hour) => (
								<Card.List.Item key={hour.label} invalid={!hour.available}>
									<Card.List.Item.Text weight="normal">
										{hour.label}:
									</Card.List.Item.Text>
									<Card.List.Item.Text weight="light">
										{hour.value}
									</Card.List.Item.Text>
								</Card.List.Item>
							))}
						</Card.List>
					</Card>

					<Card>
						<Badge>
							<Badge.Text>Fetiches</Badge.Text>
						</Badge>
						<Card.List className="flex flex-wrap gap-2">
							{Fetishes.map((fetish) => (
								<Card.Badge
									key={fetish.id}
									className="w-fit"
									colorScheme="primary"
								>
									<Card.Badge.Text>{fetish.value}</Card.Badge.Text>
									<Card.Badge.Icon name="ArrowRight" size="24" />
								</Card.Badge>
							))}
						</Card.List>
					</Card>

					<Card>
						<Badge>
							<Badge.Text>Serviços oferecidos</Badge.Text>
						</Badge>
						<Card.List>
							{AvailableServices.map((service) => (
								<Card.List.Item key={service.id}>
									<Card.List.Item.Text weight="normal">
										{service.value}
									</Card.List.Item.Text>
								</Card.List.Item>
							))}
						</Card.List>
					</Card>

					<Card className="lg:hidden">
						<Badge>
							<Badge.Text>Valores</Badge.Text>
						</Badge>

						<Card.List>
							{Prices.map((price) => (
								<Card.List.Item key={price.label} invalid={!price.available}>
									<Card.List.Item.Text weight="normal">
										{price.label}:
									</Card.List.Item.Text>
									<Card.List.Item.Text weight="light">
										{price.price ? `${price.price}€` : 'Não realiza'}
									</Card.List.Item.Text>
								</Card.List.Item>
							))}
						</Card.List>
					</Card>
				</div>
				<div className="col-span-4">
					<Stack className="gap-4 lg:sticky lg:top-[100px]">
						<Card className="hidden lg:flex">
							<Stack
								direction="row"
								className="items-center justify-between gap-2"
							>
								<Text as="h3" weight="bold">
									€120/1 hora
								</Text>
							</Stack>
							<Stack direction="row" className="w-full gap-2">
								<Button className="w-full">
									<Button.Text>Telefone</Button.Text>
								</Button>
								<Button className="w-full">
									<Button.Text>WhatsApp</Button.Text>
								</Button>
							</Stack>
						</Card>

						<Card className="hidden lg:flex">
							<Badge>
								<Badge.Text>Valores</Badge.Text>
							</Badge>

							<Card.List>
								{Prices.map((price) => (
									<Card.List.Item key={price.label} invalid={!price.available}>
										<Card.List.Item.Text weight="normal">
											{price.label}:
										</Card.List.Item.Text>
										<Card.List.Item.Text weight="light">
											{price.price ? `${price.price}€` : 'Não realiza'}
										</Card.List.Item.Text>
									</Card.List.Item>
								))}
							</Card.List>
						</Card>
					</Stack>
				</div>
			</div>
		</Container>
	);
}
