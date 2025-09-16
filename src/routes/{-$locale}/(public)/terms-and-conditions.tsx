import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/core/Stack';
import TermsAndConditions from '@/components/mdx/pages/terms-and-conditions.mdx';

export const Route = createFileRoute(
	'/{-$locale}/(public)/terms-and-conditions',
)({
	component: RouteComponent,
});
// 	{
// 		key: 'introduction',
// 		title: 'Introdução e Aceitação dos Termos',
// 		description:
// 			'Bem-vindo à Afrodiite.com! Ao navegar e utilizar este site, você concorda com estes Termos e Condições. Se não concordar com alguma parte destas regras, por favor, não utilize a Afrodiite.com. Estes termos servem para proteger tanto as utilizadoras e os utilizadores quanto o próprio site, garantindo um ambiente seguro, transparente e respeitoso para todas as pessoas.',
// 	},
// 	{
// 		key: 'quem-pode-usar',
// 		title: 'Quem pode usar a Afrodiite.com',
// 		description:
// 			'Este site é destinado exclusivamente a pessoas com 18 anos ou mais. A Afrodiite.com não permite o acesso de menores de idade. Ao utilizar o site, você confirma que tem pelo menos 18 anos e que não irá permitir que menores utilizem ou visualizem o conteúdo disponível aqui.',
// 	},
// 	{
// 		key: 'sobre-o-servico',
// 		title: 'Sobre o serviço oferecido',
// 		description:
// 			'A Afrodiite.com é um site de anúncios classificados, onde acompanhantes de luxo podem divulgar os seus serviços. O site serve apenas como um local para a publicação de anúncios e não participa, intermedia ou se responsabiliza por qualquer contato, negociação ou encontro entre as utilizadoras, os utilizadores e as anunciantes. Todas as informações e decisões tomadas através dos anúncios são de inteira responsabilidade das pessoas envolvidas.',
// 	},
// 	{
// 		key: 'regras-de-uso',
// 		title: 'Regras de uso do site',
// 		description: `
//       Para garantir um ambiente seguro e respeitoso, todas as pessoas que utilizam o site devem seguir algumas regras simples:

//       • Não publique, compartilhe ou promova qualquer conteúdo ilegal, ofensivo ou que envolva menores de idade.

//       • Não utilize o site para atividades proibidas por lei, como exploração, tráfico ou qualquer tipo de violência.

//       • Respeite os direitos de outras pessoas, incluindo privacidade, imagem e propriedade intelectual.

//       • Não tente prejudicar o funcionamento da Afrodiite.com, seja por meio de ataques, fraudes ou qualquer outra ação indevida.

//       O não cumprimento destas regras pode levar à remoção de anúncios, bloqueio de contas e outras medidas necessárias.
//     `,
// 	},
// 	{
// 		key: 'publicacao-e-remocao-de-anuncios',
// 		title: 'Publicação e remoção de anúncios',
// 		description:
// 			'Os anúncios publicados na Afrodiite.com são de responsabilidade total das anunciantes. O site reserva-se o direito de recusar, editar ou remover qualquer anúncio que não esteja de acordo com estas regras ou que seja considerado impróprio, sem necessidade de aviso prévio. Se algum conteúdo for denunciado ou identificado como ilegal, ofensivo ou falso, ele poderá ser retirado do ar imediatamente.',
// 	},
// 	{
// 		key: 'responsabilidade-da-afrodiite',
// 		title: 'Responsabilidade da Afrodiite.com',
// 		description: `
//       A Afrodiite.com não é responsável pelo conteúdo dos anúncios, nem por qualquer acordo, encontro ou serviço realizado entre utilizadoras, utilizadores e anunciantes. Todas as interações e decisões tomadas através do site são de inteira responsabilidade dos próprios envolvidos. A Afrodiite.com também não garante a veracidade, qualidade ou legalidade das informações publicadas nos anúncios.
//     `,
// 	},
// 	{
// 		key: 'denuncias-e-contacto',
// 		title: 'Denúncias e contacto',
// 		description: `
//       Se você encontrar algum anúncio ou conteúdo que viole estas regras, seja ilegal ou ofensivo, utilize a opção de denúncia disponível no site. A Afrodiite.com analisará todas as denúncias recebidas e tomará as medidas necessárias para manter o ambiente seguro. Para dúvidas, sugestões ou outros assuntos, entre em contacto através do canal disponibilizado no site.
//     `,
// 	},
// 	{
// 		key: 'alteracoes',
// 		title: 'Alterações nos Termos e Condições',
// 		description: `
//       A Afrodiite.com pode atualizar estes Termos e Condições sempre que necessário. Quando houver mudanças, a nova versão será publicada no site com a data de atualização. Recomendamos que as pessoas que utilizam o site consultem esta página regularmente para estarem sempre informadas sobre as regras em vigor.
//     `,
// 	},
// 	{
// 		key: 'lei-aplicavel-e-foro',
// 		title: 'Lei aplicável e foro',
// 		description: `
//       Estes Termos e Condições seguem as leis de Portugal. Em caso de qualquer conflito ou dúvida relacionada ao uso da Afrodiite.com, o tribunal competente será o da cidade do Porto.
//     `,
// 	},
// 	{
// 		key: 'disposicoes-finais',
// 		title: 'Disposições finais',
// 		description: `
//       Se alguma parte destes Termos e Condições for considerada inválida ou sem efeito, as demais regras continuam válidas. Estes Termos, junto com a Política de Privacidade da Afrodiite.com, representam o acordo completo entre o site e as pessoas que o utilizam.
//     `,
// 	},
// ];

function RouteComponent() {
	return (
		<Container className="gap-6 py-15">
			<TermsAndConditions />
		</Container>
	);
}
