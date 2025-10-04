import { notFound } from 'next/navigation';
import { Caracteristicas } from '@/app/(private)/(painel)/perfil/caracteristicas/Caracteristicas';
import { Galeria } from '@/app/(private)/(painel)/perfil/galeria/Galeria';
import { Horarios } from '@/app/(private)/(painel)/perfil/horarios/Horarios';
import { Informacoes } from '@/app/(private)/(painel)/perfil/Informacoes';
import { Localizacao } from '@/app/(private)/(painel)/perfil/localizacao/Localizacao';
import { Precos } from '@/app/(private)/(painel)/perfil/precos/Precos';
import { Servicos } from '@/app/(private)/(painel)/perfil/servicos/Servicos';
import { Card } from '@/components/core/Card';
import { Stack } from '@/components/core/Stack';
import { BackButton } from './BackButton';
import { isValidStep, Step } from './searchParams';

export default async function Page(props: PageProps<'/onboarding/[step]'>) {
	const { step } = await props.params;

	if (!isValidStep(step)) {
		notFound();
	}

	return (
		<Stack className="lg:py-20">
			<Card className="gap-5 bg-default-50 p-4">
				<BackButton />
				<StepRouter step={step} />
			</Card>
		</Stack>
	);
}

const StepRouter = ({ step }: { step: Step }) => {
	switch (step) {
		case 'informacoes':
			return <Informacoes />;

		case 'localizacao':
			return <Localizacao />;

		case 'caracteristicas':
			return <Caracteristicas />;

		case 'horarios':
			return <Horarios />;

		case 'precos':
			return <Precos />;

		case 'servicos':
			return <Servicos />;

		case 'galeria':
			return <Galeria />;

		default:
			return notFound();
	}
};
