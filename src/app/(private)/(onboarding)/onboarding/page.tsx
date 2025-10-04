'use client';
import { Stack } from '@/components/core/Stack';
import { Alert } from './componentes/Alert';

export default function Onboarding() {
	return (
		<Stack className="gap-5">
			<h1>Onboarding</h1>

			<Alert
				mode="primary"
				title="Titulo"
				description="Descrição"
				buttonTitle="Upgrade"
			/>
			<Alert
				mode="warning"
				title="Titulo"
				description="Descrição"
				buttonTitle="Upgrade"
			/>
			<Alert
				mode="success"
				title="Titulo"
				description="Descrição"
				buttonTitle="Upgrade"
			/>
		</Stack>
	);
}
