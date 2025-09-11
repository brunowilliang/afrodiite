import { useRef } from 'react';
import { Card } from '@/components/heroui/Card';
import { Icon } from '../core/Icon';
import { Skeleton } from '../core/Skeleton';
import { Text } from '../core/Text';
import { Modal, ModalRef } from '../heroui/Modal';

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
			<Card radius="md">
				<Card.Header className="items-center gap-2 pb-0">
					<Text weight="normal">{props.title}</Text>

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
						<Text size="2xl" weight="bold">
							{props.value}
						</Text>
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
