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
import { forgotSchema } from '@/lib/auth/client';
import { api } from '@/lib/orpc';

export default function SignIn() {
	const forgotForm = useForm({
		resolver: zodResolver(forgotSchema),
		defaultValues: { email: '' },
	});

	const onSubmitForgot = async () => {
		const { error } = await api.auth.forgetPassword({
			...forgotForm.getValues(),
			// redirectTo: resetPasswordURL,
		});

		if (error) {
			toast.error(error.message ?? 'Erro ao recuperar senha');
			return;
		}
		toast.success('Se um usuário existir, enviaremos um e-mail de recuperação');
	};

	return (
		<Stack className="w-full max-w-md items-center space-y-4 text-center">
			{/* <Text align="center" as="p">
							Digite o e-mail cadastrado para receber um link de recuperação
						</Text> */}
			<Form
				validationBehavior="aria"
				onSubmit={forgotForm.handleSubmit(onSubmitForgot)}
				className="w-full space-y-1"
			>
				<Controller
					control={forgotForm.control}
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
				<div className="w-full space-y-3 py-3">
					<Button
						fullWidth
						type="submit"
						isLoading={forgotForm.formState.isSubmitting}
					>
						Recuperar Senha
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
