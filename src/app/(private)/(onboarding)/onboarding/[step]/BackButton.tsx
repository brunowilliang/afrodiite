'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/core/Button';
import { Icon } from '@/components/core/Icon';

export const BackButton = () => {
	const router = useRouter();

	return (
		<Button
			variant="light"
			color="primary"
			size="md"
			className="w-fit"
			onPress={() => router.back()}
		>
			<Icon
				name="ArrowLeft"
				variant="stroke"
				size="20"
				className="-mr-1 -ml-1"
			/>
			Voltar
		</Button>
	);
};
