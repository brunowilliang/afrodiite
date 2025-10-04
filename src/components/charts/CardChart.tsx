import { useRef } from 'react';
import { Card } from '@/components/core/Card';
import { Modal, ModalRef } from '@/components/core/Modal';
import { Badge } from '../core/Badge';
import { Icon } from '../core/Icon';
import { Skeleton } from '../core/Skeleton';

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
			<Card
				isPressable
				onPress={() => modalRef.current?.open()}
				radius="md"
				className="flex min-h-[90px] w-full flex-col items-start justify-center gap-2 bg-default/10 p-4"
				shadow="none"
			>
				<div className="flex w-full flex-row items-center justify-start gap-1 overflow-hidden text-default-500">
					<div className="h-5 w-1 animate-pulse rounded-full bg-primary/80 duration-1000" />
					<span className="overflow-hidden text-ellipsis whitespace-nowrap">
						{props.title}
					</span>
					<Icon name="Info" variant="bulk" size="20" />
				</div>
				<div className="w-full pt-2">
					{props.isLoading ? (
						<Skeleton className="h-10 w-2/3" />
					) : (
						<div className="w-fit">
							<Badge className="py-5" size="lg">
								{props.value}
							</Badge>
						</div>
					)}
				</div>
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
