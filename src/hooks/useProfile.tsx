'use client';

import {
	useIsFetching,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from '@/components/core/Toast';
import { api } from '@/lib/orpc';

export const useProfile = () => {
	const router = useRouter();
	const pathname = usePathname();
	const queryClient = useQueryClient();

	const { data: profile } = useSuspenseQuery(
		api.queries.profile.get.queryOptions({
			staleTime: 1000 * 60 * 60 * 24, // 24 hours - staleTime is the time after which the data is considered stale
			gcTime: 1000 * 60 * 60 * 24, // 24 hours - gcTime is the time after which the data is considered stale
		}),
	);

	const isFetching = useIsFetching(api.queries.profile.get.queryOptions()) > 0;

	const { mutateAsync: updateProfileMutation, isPending: isUpdating } =
		useMutation(
			api.queries.profile.update.mutationOptions({
				onSuccess: () => {
					queryClient.invalidateQueries(api.queries.profile.get.queryOptions());
				},
				onError: (error) => {
					toast.error(error?.message ?? 'Erro ao atualizar o perfil');
				},
			}),
		);

	// Wrapper to handle redirect logic
	const updateProfile = async (
		data: Parameters<typeof updateProfileMutation>[0],
		options?: {
			skipRedirect?: boolean;
			toastTitle?: string;
			showToast?: boolean;
		},
	) => {
		const result = await updateProfileMutation(data);

		const isInOnboarding = pathname?.startsWith('/onboarding');
		const showToast = options?.showToast !== false; // Default: true

		if (!result.is_onboarding_complete) {
			// If skipRedirect (auto-save in servicos/galeria), just show toast
			if (options?.skipRedirect) {
				if (showToast) {
					toast.success(options?.toastTitle || 'Salvo com sucesso!');
				}
				return result;
			}

			// If in onboarding and NOT skipRedirect, redirect back to dashboard
			if (isInOnboarding) {
				if (showToast) {
					toast.success(options?.toastTitle || 'Etapa concluída com sucesso!');
				}
				router.push('/onboarding');
				return result;
			}

			// If NOT in onboarding, redirect to onboarding
			if (showToast) {
				toast.success(options?.toastTitle || 'Etapa concluída com sucesso!');
			}
			router.push('/onboarding');
			return result;
		}

		if (showToast) {
			toast.success(options?.toastTitle || 'Perfil atualizado com sucesso!');
		}
		return result;
	};

	return {
		profile,
		updateProfile,
		isFetching,
		isUpdating,
		queryClient,
	};
};
