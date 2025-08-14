import { Section, Text } from '@react-email/components';

type Props = {
	subject: string;
};

export const Disclaimer = ({ subject }: Props) => (
	<Section className="my-0 text-center text-[#6A6377]">
		<Text className="my-0 text-[10px] leading-[14px]">
			Se você não solicitou {subject}, por favor, ignore este e-mail.
		</Text>
		<Text className="my-2 text-[10px] leading-[14px]">
			Este e-mail foi enviado automaticamente. Por favor, não responda este
			e-mail!
			<br />
			Se você tiver alguma dúvida, entre em contato conosco.
		</Text>
	</Section>
);
