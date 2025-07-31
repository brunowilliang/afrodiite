'use client';

import { Link } from '@tanstack/react-router';
import { Button } from './Button';

export const BackButton = () => {
	return (
		<Link to="/" viewTransition className="w-fit">
			<Button className="h-10 pl-2" variant="accent">
				<Button.Icon name="ArrowLeft" size={'24'} />
				<Button.Text>Voltar</Button.Text>
			</Button>
		</Link>
	);
};
