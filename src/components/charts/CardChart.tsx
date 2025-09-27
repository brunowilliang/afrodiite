import { useRef } from 'react';
import { Card } from '@/components/core/Card';
import { Modal, ModalRef } from '@/components/core/Modal';
import { Skeleton } from '@/components/core/Skeleton';
import { Icon } from '../core/Icon';

type Props = {
	title: string;
	value: string | number;
	isLoading?: boolean;
	modalTitle: string;
	modalText: string;
};

export const CardChart = (props: Props) => {
	const modalRef = useRef<ModalRef>(null);

	return (
		<>
			<Card radius="md" className="bg-default/10" shadow="none">
				<Card.Header className="items-center gap-2 pb-0">
					<p className="font-light text-default-500">{props.title}</p>

					<Icon
						name="Info"
						variant="bulk"
						size="18"
						className="cursor-pointer"
						onClick={() => modalRef.current?.open()}
					/>
				</Card.Header>
				<Card.Body className="pt-2">
					{props.isLoading ? (
						<Skeleton className="h-8 w-1/2" />
					) : (
						<p className="font-bold text-2xl text-default-600">{props.value}</p>
					)}
				</Card.Body>
			</Card>

			{props.modalText && (
				<Modal ref={modalRef} size="lg" placement="bottom-center">
					<Modal.Content>
						<Modal.Header>{props.modalTitle}</Modal.Header>
						<Modal.Body className="pt-0 pb-5">{props.modalText}</Modal.Body>
					</Modal.Content>
				</Modal>
			)}
		</>
	);
};
