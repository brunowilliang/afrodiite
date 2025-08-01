'use client';

import { Link, useCanGoBack, useRouter } from '@tanstack/react-router';
import { Button } from './Button';

export const BackButton = () => {
	const router = useRouter();
	const canGoBack = useCanGoBack();

	const handleClick = () => {
		if (canGoBack) {
			router.history.back();
		} else {
			router.history.push('/');
		}
	};

	return (
		<Link
			viewTransition
			className="w-fit"
			onClick={handleClick}
			to="/{-$locale}"
		>
			<Button className="h-10 pl-2" variant="accent">
				<Button.Icon name="ArrowLeft" size={'24'} />
				<Button.Text>Voltar</Button.Text>
			</Button>
		</Link>
	);
};
