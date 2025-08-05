import { useRouter } from '@tanstack/react-router';
import { useGoBack } from './core/BackButton';
import { Button } from './core/Button';
import { Container, Stack } from './core/Stack';
import { Text } from './core/Text';

export function NotFound() {
	const router = useRouter();
	const { handleGoBack } = useGoBack();

	return (
		<Container className="centered h-screen max-w-lg">
			<Stack className="gap-4">
				<Text as="h1" weight="bold" color="primary" align="center">
					404
				</Text>
				<Text as="h2" weight="bold" color="primary" align="center">
					Página não encontrada
				</Text>
				<Text as="p" align="center">
					A página que está procurando não existe ou foi movida.
				</Text>

				<Button onClick={handleGoBack}>
					<Button.Icon name="ArrowLeft" />
					<Button.Text>Voltar</Button.Text>
				</Button>

				<Button
					onClick={() =>
						router.navigate({
							to: '/{-$locale}',
							params: { locale: undefined },
						})
					}
				>
					<Button.Icon name="Home" />
					<Button.Text>Página Inicial</Button.Text>
				</Button>
			</Stack>
		</Container>
	);
}
