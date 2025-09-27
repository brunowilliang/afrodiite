import { addToast, type ToastProps } from '@heroui/react';

export type { ToastProps } from '@heroui/react';

export type ToastInput = string | Partial<ToastProps>;

type ToastKind = 'success' | 'error' | 'warning' | 'primary';

const VARIANT_TO_COLOR: Record<ToastKind, NonNullable<ToastProps['color']>> = {
	success: 'success',
	error: 'danger',
	warning: 'warning',
	primary: 'primary',
};

const isClient = typeof window !== 'undefined';

function normalizeInput(input: ToastInput): Partial<ToastProps> {
	if (typeof input === 'string') {
		return { title: input };
	}
	return input;
}

function emit(
	kind: ToastKind,
	input: ToastInput,
	override?: Partial<ToastProps>,
): void {
	// Avoid SSR hydration issues: toasts are client-only
	if (!isClient) return;

	const base = normalizeInput(input);
	const payload: ToastProps = {
		size: 'sm',
		timeout: 4000,
		variant: 'flat',
		...base,
		...override,
		color: VARIANT_TO_COLOR[kind],
	} as ToastProps;

	addToast(payload);
}

function success(input: ToastInput, override?: Partial<ToastProps>): void {
	emit('success', input, override);
}

function error(input: ToastInput, override?: Partial<ToastProps>): void {
	emit('error', input, override);
}

function warning(input: ToastInput, override?: Partial<ToastProps>): void {
	emit('warning', input, override);
}

function primary(input: ToastInput, override?: Partial<ToastProps>): void {
	emit('primary', input, override);
}

export const toast = {
	success,
	error,
	warning,
	primary,
};

export type ToastAPI = typeof toast;

// Example usage:
// toast.success('Login realizado com sucesso')
// toast.error({ title: 'Falha ao entrar', description: 'Credenciais inválidas' })
