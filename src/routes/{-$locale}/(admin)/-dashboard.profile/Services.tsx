import { Card, Divider } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { Fragment, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { ProfileUpdate } from '@/api/utils/types/escort';
import { Icon } from '@/components/core/Icon';
import { Text } from '@/components/core/Text';
import { Input } from '@/components/heroui/Input';
import { Modal, ModalRef } from '@/components/heroui/Modal';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { DATA_SERVICES } from '@/utils/services';

export const ServicesTab = () => {
	const router = useRouter();
	const modalRef = useRef<ModalRef>(null);
	const [modalService, setModalService] = useState<{
		label: string;
		description: string;
	} | null>(null);
	const { session, profile } = useRouteContext({ from: '/{-$locale}' });

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	// Deriva ids selecionados iniciais do profile.services (pode ser number[] ou {id,is_available}[])
	const initialSelectedIds = useMemo(() => {
		const existing = (profile as any)?.services as unknown;
		let selected: number[] = [];
		if (Array.isArray(existing)) {
			if (existing.length === 0) selected = [];
			else if (typeof existing[0] === 'number') selected = existing as number[];
			else
				selected = (existing as Array<{ id: number; is_available: boolean }>)
					.filter((s) => s?.is_available)
					.map((s) => s.id);
		}
		return new Set<number>(selected);
	}, [profile]);

	const [selected, setSelected] = useState<Set<number>>(initialSelectedIds);

	// Toggle com save imediato (otimista + rollback onError)
	const toggle = (id: number, checked: boolean) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (checked) next.add(id);
			else next.delete(id);

			updateProfile.mutate(
				{
					id: session?.user.id,
					services: Array.from(next),
				} as ProfileUpdate,
				{
					onError: () => {
						// rollback
						setSelected(prev);
						toast.error('Falha ao salvar serviços');
					},
					onSuccess: () => {
						router.invalidate();
					},
				},
			);
			return next;
		});
	};

	return (
		<div className="w-full space-y-3">
			<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
				{DATA_SERVICES.map(({ id, label, description, short_description }) => (
					<Fragment key={id}>
						<Card
							onPress={() => {
								toggle(id, !selected.has(id));
							}}
							isPressable
							className={cn(
								'flex w-full flex-row items-center justify-start gap-2 rounded-lg bg-content1 p-3 transition-all duration-300',
								'border-2',
								selected.has(id) ? 'border-primary' : 'border-transparent',
							)}
						>
							<div
								className="h-full pt-1"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation(); // não toggle
									modalRef.current?.open();
									setModalService({ label, description });
								}}
							>
								<Icon name="Info" variant="bulk" size="20" />
							</div>
							<div className="flex h-full w-full flex-col items-start gap-0">
								<p className="w-fit text-left text-sm">{label}</p>
								<p className="text-left text-default-500 text-tiny">
									{short_description}
								</p>
							</div>
							<Input.Switch
								isSelected={selected.has(id)}
								onValueChange={(v) => toggle(id, v)}
							/>
						</Card>
					</Fragment>
				))}
			</div>

			<Modal ref={modalRef} placement="top-center">
				<Modal.Content>
					<Modal.Header className="px-6 pt-5 pb-3 text-default-700">
						{modalService?.label}
					</Modal.Header>
					<Divider className="bg-default-200/50" />
					<Modal.Body className="px-6 pt-3 pb-5">
						<Text align="left" as="p" className="text-default-600">
							{modalService?.description}
						</Text>
					</Modal.Body>
				</Modal.Content>
			</Modal>
		</div>
	);
};
