import { Badge } from './core/Badge';
import { Card } from './core/Card';
import { Stack } from './core/Stack';
import { Text } from './core/Text';

export const Footer = () => {
	return (
		<Stack direction="column" className="gap-2 p-4">
			<Card className="items-center justify-center gap-9 py-9">
				<img src="/assets/logo.svg" alt="Afrodiite" width={120} height={21} />
				<Stack direction="column" className="centered gap-4">
					<Badge>
						<Badge.Text>Informações</Badge.Text>
					</Badge>
					<Text>Contactos</Text>
					<Text>Termos e Condições</Text>
					<Text>Política de Privacidade</Text>
					<Text>Política de Cookies</Text>
				</Stack>
				<Stack direction="column" className="centered gap-4">
					<Badge>
						<Badge.Text>Para as anunciantes</Badge.Text>
					</Badge>
					<Text>Anuncie</Text>
					<Text>Área Reservada</Text>
				</Stack>
			</Card>
			<Card className="items-center justify-center">
				<Text align="center" color="textSecondary">
					© 2025 Afrodiite.com
					<br />
					Todos os direitos reservados
				</Text>
			</Card>
		</Stack>
	);
};
