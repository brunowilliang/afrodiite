// import type { UploadHookControl } from 'better-upload/client';
// import { useId } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { cn } from '@/utils/cn';
// import { Icon } from '../Icon';

// type UploadDropzoneProps = {
// 	control: UploadHookControl<true>;
// 	accept?: string;
// 	metadata?: Record<string, unknown>;
// 	description?:
// 		| {
// 				fileTypes?: string;
// 				maxFileSize?: string;
// 				maxFiles?: number;
// 		  }
// 		| string;
// 	uploadOverride?: (
// 		...args: Parameters<UploadHookControl<true>['upload']>
// 	) => void;
// };

// export function UploadDropzone({
// 	control: { upload, isPending },
// 	accept,
// 	metadata,
// 	description,
// 	uploadOverride,
// }: UploadDropzoneProps) {
// 	const id = useId();

// 	const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
// 		onDrop: (files) => {
// 			if (files.length > 0 && !isPending) {
// 				if (uploadOverride) {
// 					uploadOverride(files, { metadata });
// 				} else {
// 					upload(files, { metadata });
// 				}
// 			}
// 			inputRef.current.value = '';
// 		},
// 		noClick: true,
// 	});

// 	return (
// 		<div
// 			className={cn(
// 				'relative rounded-lg border border-text-secondary border-dashed transition-colors',
// 				{
// 					'border-primary/80': isDragActive,
// 				},
// 			)}
// 		>
// 			<label
// 				{...getRootProps()}
// 				className={cn(
// 					'flex w-full min-w-72 cursor-pointer flex-col items-center justify-center rounded-lg bg-transparent px-2 py-6 transition-colors',
// 					{
// 						'cursor-not-allowed text-text-secondary': isPending,
// 						'hover:bg-accent': !isPending,
// 					},
// 				)}
// 				htmlFor={id}
// 			>
// 				<div className="my-2">
// 					{isPending ? (
// 						<Icon
// 							name="Loading"
// 							variant="solid"
// 							size="32"
// 							color="textPrimary"
// 						/>
// 					) : (
// 						<Icon name="Upload" variant="bulk" size="32" color="textPrimary" />
// 					)}
// 				</div>

// 				<div className="mt-3 space-y-1 text-center">
// 					<p className="font-medium text-sm text-text-primary">
// 						Arraste e solte arquivos aqui
// 					</p>

// 					<p className="max-w-64 text-text-secondary text-xs">
// 						{typeof description === 'string' ? (
// 							description
// 						) : (
// 							<>
// 								{description?.maxFiles &&
// 									`Você pode enviar ${description.maxFiles} arquivo${description.maxFiles !== 1 ? 's' : ''}.`}{' '}
// 								{description?.maxFileSize && `Até ${description.maxFileSize}.`}{' '}
// 								{description?.fileTypes && `Aceitos ${description.fileTypes}.`}
// 							</>
// 						)}
// 					</p>
// 				</div>

// 				<input
// 					{...getInputProps()}
// 					type="file"
// 					multiple
// 					id={id}
// 					accept={accept}
// 					disabled={isPending}
// 				/>
// 			</label>

// 			{isDragActive && (
// 				<div className="pointer-events-none absolute inset-0 rounded-lg bg-background">
// 					<div className="flex size-full flex-col items-center justify-center rounded-lg bg-accent">
// 						<Icon name="Upload" variant="bulk" size="32" color="textPrimary" />
// 						<p className="mt-3 font-semibold text-sm">
// 							Arraste e solte arquivos aqui
// 						</p>
// 					</div>
// 				</div>
// 			)}
// 		</div>
// 	);
// }
