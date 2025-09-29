'use client';

import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/core/Button';
import { Icon } from '@/components/core/Icon';
import { Input } from '@/components/core/Input';
import { Link } from '@/components/core/Link';
import { Stack } from '@/components/core/Stack';
import { toast } from '@/components/core/Toast';
import { signUpSchema } from '@/lib/auth/client';
import { api } from '@/lib/orpc';

export default function SignUp() {
	const signUpForm = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: { name: '', email: '', password: '' },
	});

	const onSubmitSignUp = async () => {
		const { error } = await api.auth.signUp.email({
			...signUpForm.getValues(),
			// callbackURL,
		});

		if (error) {
			toast.error(error.message ?? 'Erro ao criar conta');
			return;
		}

		toast.primary('Quase lá! Verifique seu e-mail', {
			description: 'Enviamos um link de verificação para sua caixa de entrada.',
		});
	};

	return (
		<Stack className="w-full items-center space-y-4 text-center">
			<Form
				validationBehavior="aria"
				onSubmit={signUpForm.handleSubmit(onSubmitSignUp)}
				className="w-full space-y-1"
			>
				<Controller
					control={signUpForm.control}
					name="name"
					render={({ field, fieldState }) => (
						<Input
							label="Nome"
							size="md"
							value={field.value ?? ''}
							onValueChange={field.onChange}
							onBlur={field.onBlur}
							ref={field.ref}
							name={field.name}
							isInvalid={!!fieldState.error}
							errorMessage={fieldState.error?.message}
						/>
					)}
				/>
				<Controller
					control={signUpForm.control}
					name="email"
					render={({ field, fieldState }) => (
						<Input
							label="E-mail"
							size="md"
							type="email"
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
					control={signUpForm.control}
					name="password"
					render={({ field, fieldState }) => (
						<Input
							label="Senha"
							size="md"
							type="password"
							value={field.value ?? ''}
							onValueChange={field.onChange}
							onBlur={field.onBlur}
							ref={field.ref}
							name={field.name}
							autoComplete="new-password"
							isInvalid={!!fieldState.error}
							errorMessage={fieldState.error?.message}
						/>
					)}
				/>
				<div className="w-full space-y-3 py-3">
					<Button
						fullWidth
						type="submit"
						isLoading={signUpForm.formState.isSubmitting}
					>
						Criar Conta
					</Button>
				</div>
			</Form>

			<Link href="/entrar" className="mt-4">
				<Icon name="ArrowLeft" className="mr-1" />
				Voltar para o login
			</Link>
		</Stack>
	);
}
