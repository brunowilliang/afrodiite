import { Avatar, cn, Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSlot, useStyled } from 'use-styled';
import { IReviews, ReviewSchema } from '@/api/utils/schemas/reviews';
import { Button } from '@/components/core/Button';
import { Card, CardProps } from '@/components/core/Card';
import { Icon } from '@/components/core/Icon';
import { Input } from '@/components/core/Input';
import { Modal, ModalRef } from '@/components/core/Modal';
import { Rating } from '@/components/core/Rating';
import { toast } from '@/components/core/Toast';
import { api } from '@/lib/orpc';
import { Badge } from './Badge';

export type ReviewsCardProps = CardProps &
	IReviews.Output & {
		endContent?: React.ReactNode;
	};

const ReviewsRoot = useStyled('div', {
	base: {
		className: 'flex flex-col gap-4 pt-6',
	},
});

export const ReviewsCard = ({
	children,
	reviewer_name,
	title,
	comment,
	rating,
	created_at,
	endContent,
	...props
}: ReviewsCardProps) => (
	<Card className="p-4" {...props}>
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<Avatar
					showFallback
					alt={reviewer_name}
					className="size-10"
					fallback={<Icon name="User" className="text-2xl text-primary" />}
					classNames={{
						base: 'bg-primary/20',
					}}
				/>
				<div className="flex flex-col gap-0">
					<p className="font-medium">{reviewer_name}</p>
					<span className="text-default-600 text-tiny">
						{new Intl.DateTimeFormat('pt-BR', {
							month: 'short',
							day: 'numeric',
							year: 'numeric',
						}).format(new Date(created_at || ''))}
					</span>
				</div>
			</div>
			<div className="flex items-center gap-1">
				{Array.from({ length: 5 }, (_, i) => {
					const isSelected = i + 1 <= (rating || 0);

					return (
						<Icon
							key={i}
							className={cn(
								'text-lg sm:text-xl',
								isSelected ? 'text-primary' : 'text-default-400',
							)}
							variant={isSelected ? 'solid' : 'stroke'}
							name="Star"
						/>
					);
				})}
				{endContent}
			</div>
		</div>
		<div className="mt-4 w-full">
			<p className="font-medium text-default-900">{title}</p>
			<p className="mt-2 text-default-600">{comment || children}</p>
		</div>
	</Card>
);

export const ReviewsHeader = ({
	escort_id,
	public_id,
}: {
	escort_id: string;
	public_id: number;
}) => {
	const modalRef = useRef<ModalRef>(null);

	const form = useForm({
		resolver: zodResolver(ReviewSchema.output),
		mode: 'onChange',
		defaultValues: {
			rating: 0,
			reviewer_name: '',
			title: '',
			comment: '',
		},
	});

	const createReview = useMutation(
		api.queries.reviews.create.mutationOptions({
			onSuccess: () => {
				form.reset();
				toast.success('Avaliação enviada com sucesso');
				modalRef.current?.close();
			},
			onError: (error) => {
				toast.error(error.message);
				toast.error('Erro ao criar avaliação');
			},
		}),
	);

	const handleSubmit = async () => {
		await createReview.mutateAsync({
			escort_id,
			public_id,
			...form.getValues(),
		});
	};

	return (
		<div className="flex items-center justify-between">
			<Badge.Custom label="Avaliações" icon="Star" size="md" className="py-5" />
			<Button size="md" onClick={() => modalRef.current?.open()}>
				<Icon name="AddComment" size="20" />
				Faça sua avaliação
			</Button>

			<Modal ref={modalRef} size="lg" placement="top-center">
				<Modal.Content className="bg-default-50">
					<Modal.Header>Faça sua avaliação</Modal.Header>
					<Modal.Body className="pt-0 pb-5">
						<Form
							validationBehavior="aria"
							onSubmit={form.handleSubmit(handleSubmit)}
							className="flex w-full flex-col gap-3"
						>
							<div className="flex flex-col items-start gap-2">
								<span className="text-default-600 text-small">
									Dê a sua nota
								</span>
								<Controller
									control={form.control}
									name="rating"
									render={({ field, fieldState }) => (
										<Rating
											{...field}
											size="lg"
											isInvalid={!!fieldState.error}
											errorMessage={fieldState.error?.message}
										/>
									)}
								/>
							</div>
							<Controller
								control={form.control}
								name="reviewer_name"
								render={({ field, fieldState }) => (
									<Input
										{...field}
										value={field.value ?? ''}
										isRequired
										label="Digite seu nome"
										isInvalid={!!fieldState.error}
										errorMessage={fieldState.error?.message}
									/>
								)}
							/>
							<Controller
								control={form.control}
								name="title"
								render={({ field, fieldState }) => (
									<Input
										{...field}
										value={field.value ?? ''}
										isRequired
										label="Digite o título"
										isInvalid={!!fieldState.error}
										errorMessage={fieldState.error?.message}
									/>
								)}
							/>
							<Controller
								control={form.control}
								name="comment"
								render={({ field, fieldState }) => (
									<Input.TextArea
										{...field}
										value={field.value ?? ''}
										label="Digite o seu comentário"
										maxRows={7}
										isInvalid={!!fieldState.error}
										errorMessage={fieldState.error?.message}
									/>
								)}
							/>

							<Button
								fullWidth
								size="md"
								type="submit"
								isLoading={createReview.isPending}
							>
								Enviar a sua avaliação
							</Button>
							<span className="w-full text-center text-default-600 text-sm">
								A sua avaliação requer aprovação antes de ser publicada!
							</span>
						</Form>
					</Modal.Body>
				</Modal.Content>
			</Modal>
		</div>
	);
};

export const Reviews = useSlot(ReviewsRoot, {
	Header: ReviewsHeader,
	Card: ReviewsCard,
});
