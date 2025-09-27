import { Button, Section, Text } from '@react-email/components';

export const Signature = () => {
	return (
		<Section className="text-center text-[#6A6377]">
			<Text className="my-0 mr-1 inline-block text-[10px] leading-[14px]">
				Atenciosamente,
			</Text>
			<Button
				href="https://www.afrodiite.com"
				className="inline-block text-[#8234e9] text-[10px]"
			>
				Afrodiite
			</Button>
		</Section>
	);
};
