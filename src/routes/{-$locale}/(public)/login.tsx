import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { Container } from '@/components/core/Stack';
import { auth } from '@/queries/auth';

export const Route = createFileRoute('/{-$locale}/(public)/login')({
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();

	const { mutateAsync: signIn, isPending: isSignInPending } =
		auth.signIn.useMutation();
	const { mutateAsync: signUp, isPending: isSignUpPending } =
		auth.signUp.useMutation();
	const { mutateAsync: signOut, isPending: isSignOutPending } =
		auth.signOut.useMutation();
	const { mutateAsync: deleteUser, isPending: isDeletePending } =
		auth.delete.useMutation();

	// Função de login direto (apenas para teste)
	const handleLogin = async () => {
		await signIn({
			email: 'eu@brunowillian.com',
			password: '123456123123',
		});

		// Invalida PRIMEIRO para refrescar a sessão
		await router.invalidate();

		// Depois navega
		router.navigate({ to: '/{-$locale}/dashboard' });
	};

	// Função de criar conta direto (apenas para teste)
	const handleSignUp = async () => {
		await signUp({
			name: 'Bruno Garcia',
			email: 'eu@brunowillian.com',
			password: '123456123123',
		});

		// Invalida PRIMEIRO para refrescar a sessão
		await router.invalidate();

		// Depois navega
		router.navigate({ to: '/{-$locale}/dashboard' });
	};

	const handleDelete = async () => {
		await deleteUser();
		router.invalidate();
	};

	// Função de logout direto (apenas para teste)
	const handleLogout = async () => {
		await signOut();
		router.invalidate();
	};

	const [email, setEmail] = useState('eu@brunowillian.com');
	const [password, setPassword] = useState('Bruno123123');

	return (
		<Container hasHeader>
			<Input
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<Input
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<Button onClick={handleLogin} disabled={isSignInPending}>
				<Button.Text>
					{isSignInPending ? 'Entrando...' : 'Login Server'}
				</Button.Text>
			</Button>

			<Button onClick={handleSignUp} disabled={isSignUpPending}>
				<Button.Text>
					{isSignUpPending ? 'Cadastrando...' : 'Cadastro'}
				</Button.Text>
			</Button>
			<Button onClick={handleLogout} disabled={isSignUpPending}>
				<Button.Text>{isSignOutPending ? 'Saindo...' : 'Logout'}</Button.Text>
			</Button>
			<Button onClick={handleDelete} disabled={isDeletePending}>
				<Button.Text>
					{isDeletePending ? 'Deletando...' : 'Deletar'}
				</Button.Text>
			</Button>
		</Container>
	);
}
