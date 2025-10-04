'use client';

import { Card, Divider } from '@heroui/react';
import { Fragment, useMemo, useRef, useState } from 'react';
import { Icon } from '@/components/core/Icon';
import { Input } from '@/components/core/Input';
import { Modal, ModalRef } from '@/components/core/Modal';
import { Stack } from '@/components/core/Stack';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';
import { DATA_SERVICES } from '@/utils/services';
import { Badge } from '../../components/Badge';

export const Servicos = () => {
	const { profile, updateProfile } = useProfile();

	const modalRef = useRef<ModalRef>(null);

	const [modalService, setModalService] = useState<{
		label: string;
		description: string;
	} | null>(null);

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

	// Toggle com save imediato usando Server Action
	const toggle = async (id: number, checked: boolean) => {
		// Atualização otimista
		setSelected((prev) => {
			const next = new Set(prev);
			if (checked) next.add(id);
			else next.delete(id);
			return next;
		});

		// Server Action
		const newServices = checked
			? [...Array.from(selected), id]
			: Array.from(selected).filter((serviceId) => serviceId !== id);

		await updateProfile({ services: newServices });
	};

	return (
		<Stack className="gap-5">
			<Badge icon="Services" label="Serviços" />
			<div className="w-full space-y-3">
				<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2">
					{DATA_SERVICES.map(
						({ id, label, description, short_description }) => (
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
											e.stopPropagation();
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
						),
					)}
				</div>

				<Modal ref={modalRef} placement="top-center" isDismissable={false}>
					<Modal.Content>
						<Modal.Header className="px-6 pt-5 pb-3 text-default-700">
							{modalService?.label}
						</Modal.Header>
						<Divider className="bg-default-200/50" />
						<Modal.Body className="px-6 pt-3 pb-5">
							<p className="text-default-600">{modalService?.description}</p>
						</Modal.Body>
					</Modal.Content>
				</Modal>
			</div>
		</Stack>
	);
};
