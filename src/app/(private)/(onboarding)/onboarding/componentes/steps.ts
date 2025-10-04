type Step = {
	key: string;
	title: string;
	description: string;
	button: string;
	link: string;
};

export const steps: Step[] = [
	{
		key: 'informacoes',
		title: 'Crie sua identidade ✨',
		description:
			'Seu nome, telefone, slug e data de nascimento são a base do seu perfil. Escolha detalhes que marquem presença e criem uma conexão instantânea com quem te encontra.',
		button: 'Completar',
		link: '/onboarding/informacoes',
	},
	{
		key: 'localizacao',
		title: 'Marque seu território 📍',
		description:
			'Defina a cidade e a região onde você atua. Mostre onde seu brenho acontece e facilite que o público certo chegue até você com apenas um clique.',
		button: 'Completar',
		link: '/onboarding/localizacao',
	},
	{
		key: 'caracteristicas',
		title: 'Exiba seu diferencial 🌟',
		description:
			'Gênero, idade, altura, peso — cada detalhe conta uma história. Adicione características que destacam o que te torna único e fazem seu perfil vibrar.',
		button: 'Completar',
		link: '/onboarding/caracteristicas',
	},
	{
		key: 'horarios',
		title: 'Sincronize o desejo ⏰',
		description:
			'Horários claros mostram quando você está pronta para brilhar. Configure sua agenda para garantir encontros que fluem no ritmo certo, sem desencontros.',
		button: 'Completar',
		link: '/onboarding/horarios',
	},
	{
		key: 'precos',
		title: 'Estabeleça seu preço 💸',
		description:
			'Seja transparente com seus valores. Uma tabela de preços clara reflete confiança e deixa evidente que cada momento com você vale cada centavo.',
		button: 'Completar',
		link: '/onboarding/precos',
	},
	{
		key: 'servicos',
		title: 'Acenda a expectativa 🔥',
		description:
			'Liste os serviços que você oferece com detalhes que despertam interesse. Mostre o que torna cada experiência única e deixe todos curiosos pelo próximo passo.',
		button: 'Completar',
		link: '/onboarding/servicos',
	},
	{
		key: 'galeria',
		title: 'Roube a cena 📸',
		description:
			'Fotos são seu cartão de visita. Escolha imagens que param o scroll, provocam um segundo olhar e transformam curiosidade em decisão imediata.',
		button: 'Completar',
		link: '/onboarding/galeria',
	},
] as const;
