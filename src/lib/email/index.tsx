import { type CreateEmailOptions, Resend } from 'resend';
import { env } from '@/env';

type Props = CreateEmailOptions;

type PartialProps = Partial<CreateEmailOptions>;

const DEFAULT_FROM = 'Afrodiite <no-reply@mail.afrodiite.com>';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(props: PartialProps) {
	const result = await resend.emails.send({
		from: props.from ?? DEFAULT_FROM,
		...props,
	} as Props);

	if (result.error) throw result.error;
	return result;
}

export type { Props };
