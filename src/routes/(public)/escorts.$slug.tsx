import { createFileRoute } from '@tanstack/react-router';
import { BackButton } from '@/components/core/BackButton';
import { Badge } from '@/components/core/Badge';
import { Card } from '@/components/core/Card';
import { Icon } from '@/components/core/Icon';
import { Rating } from '@/components/core/Rating';
import { Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { ImageCarousel } from '@/components/ImageCarousel';

export const Route = createFileRoute('/(public)/escorts/$slug')({
	component: RouteComponent,
	loader: async ({ params }) => {
		return params;
	},
});

function RouteComponent() {
	return (
		<Stack container className="mt-[86px] gap-4 py-4">
			<BackButton />
			<Card className="gap-1 p-1">
				<ImageCarousel />
				<Stack className="w-full items-start gap-3 p-3">
					<Stack className="items-start">
						<Text as="h5" weight="light" align="center" color="textSecondary">
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

			<Card>
				<Badge>
					<Badge.Text>Sobre Mim</Badge.Text>
				</Badge>
				<Text as="p" weight="light">
					Oi, eu sou a Alycia Bittencourt, sua acompanhante dos sonhos, pronta
					para te levar ao delírio com meu charme e sensualidade. Com um sorriso
					provocante e um corpo que desperta desejos, sei como te envolver em
					momentos de pura safadeza e prazer. Adoro explorar fantasias, desde um
					jantar sedutor até encontros quentes e íntimos, sempre com muita
					entrega e discrição. Sou atenciosa, carinhosa e especialista em
					transformar seus desejos mais secretos em realidade, com um toque de
					malícia que vai te fazer perder o fôlego. Seja para uma noite de
					paixão, um evento com um toque especial ou uma aventura sem limites,
					estou aqui para te proporcionar experiências inesquecíveis, com toda a
					minha energia provocante e autenticidade.
				</Text>
			</Card>

			<Card>
				<Badge>
					<Badge.Text>Características</Badge.Text>
				</Badge>
				<Text as="p" weight="light">
					Características
				</Text>
			</Card>

			<Card>
				<Badge>
					<Badge.Text>Horário de expediente</Badge.Text>
				</Badge>
				<Text as="p" weight="light">
					Horário de expediente
				</Text>
			</Card>

			<Card>
				<Badge>
					<Badge.Text>Fetiches</Badge.Text>
				</Badge>
				<Text as="p" weight="light">
					Fetiches
				</Text>
			</Card>

			<Card>
				<Badge>
					<Badge.Text>Serviços oferecidos</Badge.Text>
				</Badge>
				<Text as="p" weight="light">
					Serviços oferecidos
				</Text>
			</Card>
		</Stack>
	);
}
