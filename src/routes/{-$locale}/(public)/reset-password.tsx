import { Button, Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { Input } from '@/components/heroui/Input';
import { toast } from '@/components/heroui/Toast';
import { api } from '@/lib/api';

const Schema = z.object({
	token: z.string().optional(),
	error: z.string().optional(),
});

const resetPasswordSchema = z.object({
	password: z
		.string({
			message: 'A senha deve conter pelo menos 6 caracteres',
		})
		.min(6, {
			message: 'A senha deve conter pelo menos 6 caracteres',
		}),
	confirm: z
		.string({
			message: 'As senhas não conferem',
		})
		.min(6, {
			message: 'As senhas não conferem',
		}),
});

export const Route = createFileRoute('/{-$locale}/(public)/reset-password')({
	validateSearch: Schema,
	component: RouteComponent,
	beforeLoad: ({ search }) => {
		if (search.error) return;
		if (!search.token) return redirect({ to: '/{-$locale}/sign-in' });
	},
});

function RouteComponent() {
	const { token, error } = Route.useSearch();
	const navigate = Route.useNavigate();

	const form = useForm({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { password: '', confirm: '' },
	});

	const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
		if (values.password !== values.confirm) {
			return toast.error('As senhas não conferem');
		}

		const { error: err } = await api.auth.resetPassword({
			token: token,
			newPassword: values.password,
		});

		if (err) {
			return toast.error(err.message ?? 'Erro ao redefinir senha');
		}

		toast.success('Senha redefinida com sucesso');

		await navigate({ to: '/{-$locale}/sign-in' });
	};

	return (
		<Container className="centered h-screen">
			<Stack className="centered w-full space-y-10">
				{error && (
					<Text align="center" as="h4" className="text-danger">
						Link inválido ou expirado.
					</Text>
				)}
				<Text align="center" as="h4">
					Crie uma nova senha
				</Text>
				<Form
					validationBehavior="aria"
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full max-w-sm items-center space-y-3"
				>
					<Controller
						control={form.control}
						name="password"
						render={({ field, fieldState }) => (
							<Input
								label="Nova senha"
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

					<Controller
						control={form.control}
						name="confirm"
						render={({ field, fieldState }) => (
							<Input
								label="Confirmar senha"
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

					<Button
						size="lg"
						className="mt-4"
						color="primary"
						fullWidth
						type="submit"
						disabled={!!error}
						isLoading={form.formState.isSubmitting}
					>
						Criar nova senha
					</Button>
				</Form>
			</Stack>
		</Container>
	);
}
