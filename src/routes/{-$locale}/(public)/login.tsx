import { createFileRoute, type useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { Input } from '@/components/core/Input';
import { Container } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { signIn, signOut } from '@/lib/auth-client';

export const handleSignOut = async (
	navigate: ReturnType<typeof useNavigate>,
) => {
	const result = await signOut();

	if (result.error) {
		console.error(result.error);
		return;
	}

	toast('Logout realizado com sucesso');
	navigate({ to: '/{-$locale}' });
};

export const Route = createFileRoute('/{-$locale}/(public)/login')({
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = Route.useRouteContext();
	const navigate = Route.useNavigate();

	const [email, setEmail] = useState('eu@brunowillian.com');
	const [password, setPassword] = useState('Bruno123123');

	const login = async () => {
		const result = await signIn.email({
			email: email,
			password: password,
		});

		if (result.error) {
			toast(result.error.message);
			console.error(result.error);
			return;
		}
		toast('Login realizado com sucesso');
		navigate({ to: '/{-$locale}/dashboard' });
	};

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

			{session && (
				<Card>
					<Text>Email: {session.user?.email}</Text>
					<Text>Name: {session.user?.name}</Text>
					<Text>Image: {session.user?.image}</Text>
				</Card>
			)}

			{!session ? (
				<Button onClick={() => login()}>
					<Button.Text>Login</Button.Text>
				</Button>
			) : (
				<Button onClick={() => handleSignOut(navigate)}>
					<Button.Text>Logout</Button.Text>
				</Button>
			)}
		</Container>
	);
}
