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

export const ConfirmYourAccount = ({ name, url }: Props) => {
	return (
		<Html>
			<Head />
			<Tailwind config={{ presets: [pixelBasedPreset] }}>
				<Body>
					<Preview>Confirme sua conta Afrodiite</Preview>
					<Body.Container>
						<Header />

						<Body.Border />

						<Heading title="Confirme sua conta Afrodiite!" />

						<Body.Section>
							<Body.Text>Olá, {name}!</Body.Text>
							<Body.Text>
								Para começar, confirme seu endereço de e-mail abaixo. Depois
								disso, você poderá criar o seu perfil diretamente no site.
							</Body.Text>
						</Body.Section>

						<Button href={url}>Confirmar meu e-mail</Button>

						<Body.Border />

						<Disclaimer subject="a criação de uma conta" />
						<Signature />
					</Body.Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

ConfirmYourAccount.PreviewProps = {
	name: 'Bruno Garcia',
	url: 'https://www.afrodiite.com',
} as Props;

export default ConfirmYourAccount;
