'use client';

import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { Link } from '@/components/core/Link';
import { Stack } from '@/components/core/Stack';
import { toast } from '@/components/core/Toast';
import { signInSchema } from '@/lib/auth/client';
import { api } from '@/lib/orpc';

export default function SignIn() {
	const router = useRouter();

	const signInForm = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: '', password: '' },
	});

	const onSubmitSignIn = async () => {
		const { error } = await api.auth.signIn.email({
			...signInForm.getValues(),
			// callbackURL,
		});

		if (error) {
			if (error.status === 403) {
				toast.primary('Quase lá! Verifique seu e-mail', {
					description:
						'Enviamos um link de verificação para sua caixa de entrada.',
				});
				return;
			}
			toast.error(error.message ?? 'Erro ao fazer login');
			return;
		}

		await router.refresh();
	};

	return (
		<Stack className="w-full space-y-4 text-center">
			{/* <Text align="center" as="h4">
					Fazer Login
				</Text> */}
			<Form
				validationBehavior="aria"
				onSubmit={signInForm.handleSubmit(onSubmitSignIn)}
				className="w-full space-y-1"
			>
				<Controller
					control={signInForm.control}
					name="email"
					render={({ field, fieldState }) => (
						<Input
							label="E-mail"
							size="md"
							type="email"
							customVariant="transparent"
							value={field.value ?? ''}
							onValueChange={field.onChange}
							onBlur={field.onBlur}
							ref={field.ref}
							name={field.name}
							autoComplete="email"
							isInvalid={!!fieldState.error}
							errorMessage={fieldState.error?.message}
						/>
					)}
				/>
				<Controller
					control={signInForm.control}
					name="password"
					render={({ field, fieldState }) => (
						<Input
							label="Senha"
							size="md"
							type="password"
							customVariant="transparent"
							value={field.value ?? ''}
							onValueChange={field.onChange}
							onBlur={field.onBlur}
							ref={field.ref}
							name={field.name}
							autoComplete="current-password"
							isInvalid={!!fieldState.error}
							errorMessage={fieldState.error?.message}
						/>
					)}
				/>
				<div className="w-full space-y-3 py-3">
					<Button
						fullWidth
						type="submit"
						isLoading={signInForm.formState.isSubmitting}
					>
						Entrar
					</Button>
					<Button as={Link} fullWidth variant="flat" href="/cadastrar">
						Criar Conta
					</Button>
				</div>
				<div className="centered flex w-full flex-col gap-2 py-1 text-center sm:flex-row">
					<span>Precisa recuperar sua senha?</span>
					<Link size="sm" href="/esqueci-senha">
						Clique aqui
					</Link>
				</div>
			</Form>
		</Stack>
	);
}
