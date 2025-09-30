'use client';

import {
	useIsFetching,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from '@/components/core/Toast';
import { api } from '@/lib/orpc';

export const useProfile = () => {
	const queryClient = useQueryClient();

	const { data: profile } = useSuspenseQuery(
		api.queries.profile.get.queryOptions(),
	);

	const isFetching = useIsFetching(api.queries.profile.get.queryOptions()) > 0;

	const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation(
		api.queries.profile.update.mutationOptions({
			onSuccess: () => {
				toast.success('Perfil atualizado com sucesso!');
				queryClient.invalidateQueries(api.queries.profile.get.queryOptions());
			},
			onError: (error) => {
				toast.error(error?.message ?? 'Erro ao atualizar avaliação');
			},
		}),
	);

	return {
		profile,
		updateProfile,
		isFetching,
		isUpdating,
		queryClient,
	};
};
