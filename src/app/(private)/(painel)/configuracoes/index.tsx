'use client';

import { Chip } from '@heroui/react';
import { useState } from 'react';
import { Input } from '@/components/core/Input';
import { useProfile } from '@/hooks/useProfile';
import { Countries } from '@/utils/lists/Countries';

export const ConfiguracoesIndex = () => {
	// const queryClient = useQueryClient();

	const { profile, updateProfile } = useProfile();

	// const { data: profile } = useSuspenseQuery(
	// 	api.queries.profile.get.queryOptions(),
	// );

	// const { mutateAsync: updateProfile } = useMutation(
	// 	api.queries.profile.update.mutationOptions({
	// 		onSuccess: () => {
	// 			toast.success('Perfil atualizado com sucesso!');
	// 			queryClient.invalidateQueries({
	// 				queryKey: api.queries.profile.get.queryKey(),
	// 			});
	// 		},
	// 		onError: (error) => {
	// 			toast.error(error?.message ?? 'Erro ao atualizar perfil');
	// 		},
	// 	}),
	// );

	// Estado para países selecionados
	const [selectedCountries, setSelectedCountries] = useState<string[]>(
		profile?.blocked_countries || [],
	);

	// Estado para controlar input do AutoComplete
	const [inputValue, setInputValue] = useState('');

	// Função para adicionar país com save automático
	const addCountry = async (sigla: string) => {
		if (!selectedCountries.includes(sigla)) {
			const newSelection = [...selectedCountries, sigla];
			setSelectedCountries(newSelection);
			setInputValue(''); // Limpa o input após selecionar

			// Save automático
			await updateProfile({
				blocked_countries: newSelection,
			});
		}
	};

	// Função para remover país com save automático
	const removeCountry = async (sigla: string) => {
		// const previousSelection = [...selectedCountries];
		const newSelection = selectedCountries.filter((s) => s !== sigla);
		setSelectedCountries(newSelection);

		// Save automático
		await updateProfile({
			blocked_countries: newSelection,
		});
		// const [error] = await execute({
		// 	blocked_countries: newSelection,
		// } as IProfile.Update);

		// if (error) {
		// 	// Rollback em caso de erro
		// 	setSelectedCountries(previousSelection);
		// 	toast.error(error?.message ?? 'Erro ao desbloquear país');
		// 	return;
		// }

		// toast.success('País desbloqueado com sucesso!');
		// router.refresh();
	};

	// Países disponíveis (não selecionados)
	const availableCountries = Countries.filter(
		({ sigla }) => !selectedCountries.includes(sigla),
	);

	return (
		<div className="w-full space-y-3">
			<div className="space-y-3">
				<div className="space-y-2">
					<label className="font-medium text-sm">Países Bloqueados</label>
					<p className="text-default-500 text-xs">
						Selecione os países que você não quer atender
					</p>
				</div>

				{/* Chips dos países selecionados */}
				{selectedCountries.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{selectedCountries.map((sigla) => {
							const country = Countries.find((c) => c.sigla === sigla);
							return (
								<Chip
									key={sigla}
									onClose={() => removeCountry(sigla)}
									variant="flat"
									color="primary"
								>
									{country?.nome_pais || sigla}
								</Chip>
							);
						})}
					</div>
				)}

				{/* AutoComplete para adicionar países */}
				<Input.AutoComplete
					label="Digite para buscar países..."
					inputValue={inputValue}
					onInputChange={setInputValue}
					allowsCustomValue={false}
					onSelectionChange={(key) => {
						if (key) {
							addCountry(key as string);
						}
					}}
				>
					{availableCountries.map(({ sigla, nome_pais }) => (
						<Input.AutoComplete.Item key={sigla}>
							{nome_pais}
						</Input.AutoComplete.Item>
					))}
				</Input.AutoComplete>
			</div>
		</div>
	);
};
