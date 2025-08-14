import { Heading as HeadingEmail } from '@react-email/components';

type Props = {
	title: string;
};

export const Heading = ({ title }: Props) => (
	<HeadingEmail as="h1" className="m-0 text-2xl">
		{title}
	</HeadingEmail>
);
