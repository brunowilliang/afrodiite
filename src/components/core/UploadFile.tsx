import { Card } from '@heroui/react';
import type { UploadHookControl } from 'better-upload/client';
import { useId } from 'react';
import { useDropzone } from 'react-dropzone';
import { Icon } from '@/components/core/Icon';
import { cn } from '@/utils/cn';

type UploadDropzoneProps = {
	control: UploadHookControl<true>;
	accept?: string;
	metadata?: Record<string, unknown>;
	description?:
		| {
				fileTypes?: string;
				maxFileSize?: string;
				maxFiles?: number;
		  }
		| string;
	uploadOverride?: (
		...args: Parameters<UploadHookControl<true>['upload']>
	) => void;
};

export function UploadDropzone({
	control: { upload, isPending },
	accept,
	metadata,
	description,
	uploadOverride,
}: UploadDropzoneProps) {
	const id = useId();

	const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
		onDrop: (files) => {
			if (files.length > 0 && !isPending) {
				if (uploadOverride) {
					uploadOverride(files, { metadata });
				} else {
					upload(files, { metadata });
				}
			}
			inputRef.current.value = '';
		},
		noClick: true,
	});

	return (
		<Card
			isPressable
			isHoverable
			className={cn(
				'relative rounded-lg border-2 border-default border-dashed transition-all duration-400',
				{
					'border-primary/80': isDragActive,
				},
			)}
		>
			<label
				{...getRootProps()}
				className={cn(
					'flex w-full min-w-72 cursor-pointer flex-col items-center justify-center rounded-lg bg-tranparent px-2 py-8 transition-colors',
					{
						'cursor-not-allowed text-default-500': isPending,
						'hover:bg-transparent': !isPending,
					},
				)}
				htmlFor={id}
			>
				<div>
					{isPending ? (
						<Icon
							name="Loading"
							variant="solid"
							size="32"
							color="textPrimary"
						/>
					) : (
						<Icon
							name="ImageUpload"
							variant="bulk"
							size="32"
							className="text-default-500"
						/>
					)}
				</div>

				<div className="mt-2 space-y-1 text-center">
					<p className="text-default-500 text-md">
						Arraste e solte arquivos aqui
					</p>

					<p className="max-w-64 text-default-500 text-tiny">
						{typeof description === 'string' ? (
							description
						) : (
							<>
								{description?.maxFiles &&
									`Você pode enviar ${description.maxFiles} arquivo${description.maxFiles !== 1 ? 's' : ''}.`}{' '}
								{description?.maxFileSize && `Até ${description.maxFileSize}.`}{' '}
								{description?.fileTypes && `Aceitos ${description.fileTypes}.`}
							</>
						)}
					</p>
				</div>

				<input
					{...getInputProps()}
					type="file"
					multiple
					id={id}
					accept={accept}
					disabled={isPending}
				/>
			</label>

			{isDragActive && (
				<div className="pointer-events-none absolute inset-0 rounded-lg">
					<div className="flex size-full flex-col items-center justify-center rounded-lg bg-default-200">
						<Icon
							name="ImagesAlbum"
							variant="bulk"
							size="32"
							className="text-default-500"
						/>
						<p className="mt-3 text-default-500 text-md">
							Arraste e solte arquivos aqui
						</p>
					</div>
				</div>
			)}
		</Card>
	);
}
