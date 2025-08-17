import { Form, Link } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	createFileRoute,
	redirect,
	type ToOptions,
	useRouter,
} from '@tanstack/react-router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Icon } from '@/components/core/Icon';
import { Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { Button } from '@/components/heroui/Button';
import { Input } from '@/components/heroui/Input';
import { Modal, ModalRef } from '@/components/heroui/Modal';
import { toast } from '@/components/heroui/Toast';
import { api } from '@/lib/api';
import {
	forgotSchema,
	signInSchema,
	signUpSchema,
} from '@/lib/auth/auth.client';

export const Route = createFileRoute('/{-$locale}/(public)/_app/sign-in')({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.session) {
			return redirect({ to: '/{-$locale}/dashboard' });
		}
	},
});

function RouteComponent() {
	const router = useRouter();
	const forgotModalRef = useRef<ModalRef>(null);
	const signUpModalRef = useRef<ModalRef>(null);

	const buildCallbackURL = (to: ToOptions['to']) => {
		if (typeof window !== 'undefined') {
			const loc = router.buildLocation({ to });
			return new URL(loc.href, window.location.origin).toString();
		}
		return '';
	};

	const callbackURL = buildCallbackURL('/{-$locale}/activate');
	const resetPasswordURL = buildCallbackURL('/{-$locale}/reset-password');

	const signInForm = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: '', password: '' },
	});

	const forgotForm = useForm({
		resolver: zodResolver(forgotSchema),
		defaultValues: { email: '' },
	});

	const signUpForm = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: { name: '', email: '', password: '' },
	});

	const onSubmitSignIn = async () => {
		const { error } = await api.auth.signIn.email({
			...signInForm.getValues(),
			callbackURL,
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

		await router.invalidate();
	};

	const onSubmitForgot = async () => {
		const { error } = await api.auth.forgetPassword({
			...forgotForm.getValues(),
			redirectTo: resetPasswordURL,
		});

		if (error) {
			toast.error(error.message ?? 'Erro ao recuperar senha');
			return;
		}

		forgotModalRef.current?.close();
		toast.success('Se um usuário existir, enviaremos um e-mail de recuperação');
	};

	const onSubmitSignUp = async () => {
		const { error } = await api.auth.signUp.email({
			...signUpForm.getValues(),
			callbackURL,
		});

		signUpModalRef.current?.close();

		if (error) {
			toast.error(error.message ?? 'Erro ao criar conta');
			return;
		}

		toast.primary('Quase lá! Verifique seu e-mail', {
			description: 'Enviamos um link de verificação para sua caixa de entrada.',
		});
	};

	return (
		<div className="centered mx-auto flex min-h-[100dvh] max-w-lg flex-col gap-14 overflow-hidden px-4">
			<img src="/assets/logo.svg" className="w-32" alt="Afrodiite" />

			<Stack className="w-full max-w-md items-center space-y-4">
				<Text align="center" as="h4">
					Fazer Login
				</Text>
				<Form
					validationBehavior="aria"
					onSubmit={signInForm.handleSubmit(onSubmitSignIn)}
					className="w-full space-y-3"
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
					<div className="w-full space-y-3">
						<Button
							fullWidth
							type="submit"
							isLoading={signInForm.formState.isSubmitting}
						>
							Entrar
						</Button>
						<Button
							fullWidth
							variant="flat"
							onPress={() => signUpModalRef.current?.open()}
						>
							Criar Conta
						</Button>
					</div>
					<div className="centered flex w-full flex-col gap-2 py-1 text-center sm:flex-row">
						<span>Precisa recuperar sua senha?</span>
						<Link size="sm" onPress={() => forgotModalRef.current?.open()}>
							Clique aqui
						</Link>
					</div>
				</Form>
			</Stack>

			<Link
				onPress={() =>
					router.navigate({
						to: '/{-$locale}',
					})
				}
			>
				<Icon name="ArrowLeft" className="mr-1" />
				Voltar para a página inicial
			</Link>

			<Modal
				ref={forgotModalRef}
				onClose={() => forgotForm.reset()}
				placement="top-center"
			>
				<Modal.Content>
					<Modal.Header>Recuperar Senha</Modal.Header>
					<Modal.Body>
						<Text align="center" as="p">
							Digite o e-mail cadastrado para receber um link de recuperação
						</Text>
						<Form
							validationBehavior="aria"
							onSubmit={forgotForm.handleSubmit(onSubmitForgot)}
							className="space-y-3"
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
							<Modal.Footer className="w-full px-0">
								<Button
									color="danger"
									variant="light"
									fullWidth
									onPress={() => forgotModalRef.current?.close()}
								>
									Cancelar
								</Button>
								<Button
									fullWidth
									type="submit"
									isLoading={forgotForm.formState.isSubmitting}
								>
									Recuperar Senha
								</Button>
							</Modal.Footer>
						</Form>
					</Modal.Body>
				</Modal.Content>
			</Modal>

			<Modal
				ref={signUpModalRef}
				onClose={() => signUpForm.reset()}
				placement="top-center"
			>
				<Modal.Content>
					<Modal.Header>Criar Conta</Modal.Header>
					<Modal.Body>
						<Text align="center" as="p">
							Digite o nome, e-mail e senha para criar uma conta
						</Text>
						<Form
							validationBehavior="aria"
							onSubmit={signUpForm.handleSubmit(onSubmitSignUp)}
							className="space-y-3"
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

							<Modal.Footer className="w-full px-0">
								<Button
									color="danger"
									variant="light"
									fullWidth
									onPress={() => signUpModalRef.current?.close()}
								>
									Cancelar
								</Button>
								<Button
									fullWidth
									type="submit"
									isLoading={signUpForm.formState.isSubmitting}
								>
									Criar Conta
								</Button>
							</Modal.Footer>
						</Form>
					</Modal.Body>
				</Modal.Content>
			</Modal>
		</div>
	);
}
