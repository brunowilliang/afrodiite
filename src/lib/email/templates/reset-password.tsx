import {
	Head,
	Html,
	Preview,
	pixelBasedPreset,
	Tailwind,
} from '@react-email/components';
import { Body } from '../components/Body';
import { Button } from '../components/Button';
import { Disclaimer } from '../components/Disclaimer';
import { Header } from '../components/Header';
import { Heading } from '../components/Heading';
import { Signature } from '../components/Signature';

interface Props {
	name?: string;
	url?: string;
}

export const ResetPassword = ({ name, url }: Props) => {
	return (
		<Html>
			<Head />
			<Tailwind config={{ presets: [pixelBasedPreset] }}>
				<Body>
					<Preview>Redefina sua senha Afrodiite</Preview>
					<Body.Container>
						<Header />

						<Body.Border />

						<Heading title="Redefina sua senha Afrodiite!" />

						<Body.Section>
							<Body.Text>Olá, {name}!</Body.Text>
							<Body.Text>
								Recentemente, alguém solicitou uma alteração de senha para sua
								conta do Afrodiite. Se foi você, pode definir uma nova senha
								clicando no botão abaixo.
							</Body.Text>
						</Body.Section>

						<Button href={url}>Redefinir minha senha</Button>

						<Body.Border />

						<Disclaimer subject="a redefinição de sua senha" />
						<Signature />
					</Body.Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

ResetPassword.PreviewProps = {
	name: 'Bruno Garcia',
	url: 'https://www.afrodiite.com',
} as Props;

export default ResetPassword;
