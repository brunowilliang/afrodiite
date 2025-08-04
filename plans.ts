export type Plan = {
	id: {
		sandbox: string;
		production: string;
	};
	name: string;
	slug: string;
	description: string;
};

export type Boosts = {
	prime: Plan;
	supreme: Plan;
};

export type Plans = {
	premium: Plan[];
	boosts: Boosts;
};

export const plans: Plans[] = [
	{
		premium: [
			{
				id: {
					sandbox: '70347f1f-cced-484a-b0e9-44272f10d3c4',
					production: '',
				},
				name: 'Premium',
				slug: 'premium',
				description:
					'Ative seu perfil e esteja visível para todos. Com o Plano Premium, seu anúncio aparece nas buscas e pode ser encontrado 24 horas por dia!',
			},
		],
		boosts: {
			prime: {
				id: {
					sandbox: '58037ff9-e277-4cb0-ab03-c8d932580d2e',
					production: '',
				},
				name: 'Boost Prime',
				slug: 'boost-prime',
				description:
					'Intensifique sua presença durante 14 dias, garantindo posição de destaque imediato nas buscas. Ideal para quem deseja atrair atenção qualificada de forma rápida e estratégica.',
			},
			supreme: {
				id: {
					sandbox: 'cba0df33-0a01-4078-a844-41932419142f',
					production: '',
				},
				name: 'Boost Supreme',
				slug: 'boost-supreme',
				description:
					'Domine as primeiras posições por 30 dias consecutivos, assegurando exposição contínua e resultados consistentes. A escolha certa para manter seu nome em evidência por mais tempo.',
			},
		},
	},
];
