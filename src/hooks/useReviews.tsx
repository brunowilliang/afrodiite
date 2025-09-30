'use client';

import {
	useIsFetching,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from '@/components/core/Toast';
import { api } from '@/lib/orpc';

export const useReviews = () => {
	const queryClient = useQueryClient();

	const { data: reviews } = useSuspenseQuery(
		api.queries.reviews.list.queryOptions(),
	);

	const isFetching = useIsFetching(api.queries.reviews.list.queryOptions()) > 0;

	const { mutateAsync: updateReview, isPending: isUpdating } = useMutation(
		api.queries.reviews.update.mutationOptions({
			onSuccess: () => {
				toast.success('Avaliação atualizada com sucesso!');
				queryClient.invalidateQueries(api.queries.reviews.list.queryOptions());
			},
			onError: (error) => {
				toast.error(error?.message ?? 'Erro ao atualizar avaliação');
			},
		}),
	);

	return {
		reviews,
		updateReview,
		isFetching,
		isUpdating,
		queryClient,
	};
};
