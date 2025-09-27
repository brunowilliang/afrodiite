// 'use client';

// import { useEffect, useState } from 'react';
// import { api } from '@/lib/orpc';
// import LoginForm from './src/app/LoginForm';

// // ✅ CSR com uso do orpc
// export default function Home() {
// 	const [session, setSession] = useState<any>(null);

// 	useEffect(() => {
// 		const fetchSession = async () => {
// 			const data = await api.orpc.session();
// 			setSession(data);
// 		};
// 		fetchSession();
// 	}, []);

// 	return (
// 		<div>
// 			<h1>Afrodiite - SSR Test</h1>

// 			<div className="rounded-md bg-white p-4">
// 				{session ? (
// 					// ✅ Sessão ativa - dados já vêm do servidor
// 					<div>
// 						<p>
// 							<strong>✅ SESSÃO + PERFIL (SSR)</strong>
// 						</p>

// 						<h3>📋 Dados da Sessão:</h3>
// 						<p>Nome: {session.user.name}</p>
// 						<p>Email: {session.user.email}</p>
// 						<p>ID: {session.user.id}</p>
// 						<p>Role: {session.user.role}</p>

// 						<h3>👤 Dados do Perfil:</h3>
// 						{session.user ? (
// 							<div>
// 								<p>Profile ID: {session.user.id}</p>
// 								<p>Profile Name: {session.user.name}</p>
// 							</div>
// 						) : (
// 							<p>❌ Perfil não encontrado</p>
// 						)}

// 						<hr />
// 						<LoginForm />
// 					</div>
// 				) : (
// 					// ❌ Sem sessão
// 					<div>
// 						<p>
// 							<strong>❌ SEM SESSÃO</strong>
// 						</p>
// 						<hr />
// 						<LoginForm />
// 					</div>
// 				)}
// 			</div>

// 			<p>
// 				<em>Dê F5 - sem loading, sessão + perfil diretos do servidor!</em>
// 			</p>
// 		</div>
// 	);
// }

// ✅ SSR com uso do orpc
// import { api } from '@/lib/orpc';
// import LoginForm from './LoginForm';

// export default async function Home() {
// 	const session = await api.orpc.session();

// 	return (
// 		<div>
// 			<h1>Afrodiite - SSR Test</h1>

// 			<div className="rounded-md bg-white p-4">
// 				{session ? (
// 					// ✅ Sessão ativa - dados já vêm do servidor
// 					<div>
// 						<p>
// 							<strong>✅ SESSÃO + PERFIL (SSR)</strong>
// 						</p>

// 						<h3>📋 Dados da Sessão:</h3>
// 						<p>Nome: {session.user.name}</p>
// 						<p>Email: {session.user.email}</p>
// 						<p>ID: {session.user.id}</p>
// 						<p>Role: {session.user.role}</p>

// 						<h3>👤 Dados do Perfil:</h3>
// 						{session.user ? (
// 							<div>
// 								<p>Profile ID: {session.user.id}</p>
// 								<p>Profile Name: {session.user.name}</p>
// 							</div>
// 						) : (
// 							<p>❌ Perfil não encontrado</p>
// 						)}

// 						<hr />
// 						<LoginForm />
// 					</div>
// 				) : (
// 					// ❌ Sem sessão
// 					<div>
// 						<p>
// 							<strong>❌ SEM SESSÃO</strong>
// 						</p>
// 						<hr />
// 						<LoginForm />
// 					</div>
// 				)}
// 			</div>

// 			<p>
// 				<em>Dê F5 - sem loading, sessão + perfil diretos do servidor!</em>
// 			</p>
// 		</div>
// 	);
// }
