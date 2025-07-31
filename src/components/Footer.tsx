import { Badge } from './core/Badge';
import { Container, Stack } from './core/Stack';
import { Text } from './core/Text';

export const Footer = () => {
	return (
		<Stack className="gap-2 bg-accent p-4">
			<Container className="centered flex-col gap-9 bg-accent py-9 md:flex-row md:items-start">
				<Stack className="w-full items-center gap-4 md:w-9/20 md:items-start">
					<img src="/assets/logo.svg" alt="Afrodiite" width={120} height={21} />
					<Text
						as="p"
						weight="light"
						className="text-center text-text-secondary md:text-left"
					>
						Afrodiite é uma plataforma de anúncios de acompanhantes de luxo, com
						a melhor seleção de acompanhantes de luxo.
					</Text>
				</Stack>
				<Stack className="w-full items-center gap-4 md:w-5/20 md:items-start">
					<Badge>
						<Badge.Text>Informações</Badge.Text>
					</Badge>
					<Text>Contactos</Text>
					<Text>Termos e Condições</Text>
					<Text>Política de Privacidade</Text>
					<Text>Política de Cookies</Text>
				</Stack>
				<Stack className="w-full items-center gap-4 md:w-5/20 md:items-start">
					<Badge>
						<Badge.Text>Para as anunciantes</Badge.Text>
					</Badge>
					<Text>Anuncie</Text>
					<Text>Área Reservada</Text>
				</Stack>
			</Container>
			<Stack className="items-center justify-center">
				<Text align="center" color="textSecondary">
					© 2025 Afrodiite.com - Todos os direitos reservados
				</Text>
			</Stack>
		</Stack>
	);
};
