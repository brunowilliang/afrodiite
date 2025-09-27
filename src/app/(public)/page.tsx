'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/core/Button';
import { Logo } from '@/components/Logo';

export default function Home() {
	const router = useRouter();
	return (
		<div className="centered mx-auto flex min-h-[100dvh] max-w-lg flex-col gap-4 overflow-hidden px-4">
			<Logo className="h-10 w-40" />
			<div className="my-10 flex flex-col gap-1">
				{/* <Text as="h4" weight="light" className="text-center">
						Algo intenso está se aproximando!
					</Text>
					<Text as="h3" weight="normal" className="text-center">
						Em breve, o lugar mais excitante do país será revelado...
					</Text> */}
			</div>

			<Button
				onPress={() => router.push('/painel')}
				color="primary"
				variant="flat"
			>
				Ir para o dashboard
			</Button>

			<Button
				onPress={() => router.push('/entrar')}
				color="primary"
				variant="flat"
			>
				Realize seu login
			</Button>

			<Button onPress={() => router.push('/')} color="primary" variant="flat">
				Descubra as acompanhantes
			</Button>
		</div>
	);
}
