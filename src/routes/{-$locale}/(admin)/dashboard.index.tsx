import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/core/Button';
import { TextArea } from '@/components/core/Inputs/TextArea';
import { Container } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/')({
	component: RouteComponent,
});
function RouteComponent() {
	const navigate = Route.useNavigate();
	const [value, setValue] = useState('');

	return (
		<Container hasHeader>
			<Text size="2xl" weight="bold">
				Dashboard
			</Text>

			<Button onClick={() => navigate({ to: '/{-$locale}/dashboard/profile' })}>
				<Button.Text>go to profile</Button.Text>
			</Button>

			<TextArea
				label="Descrição"
				placeholder="Conte mais sobre você..."
				helperText={`${value.length}/1000 caracteres`}
				errorText={
					value.length > 1000 ? `${value.length}/500 caracteres` : undefined
				}
				aria-invalid={value.length > 1000}
				onChange={(e) => setValue(e.target.value)}
			/>
		</Container>
	);
}
