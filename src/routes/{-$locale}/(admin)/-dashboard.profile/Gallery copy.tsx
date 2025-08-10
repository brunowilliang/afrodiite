// //
// import { useUploadFiles } from 'better-upload/client';
// import { useEffect, useMemo, useState } from 'react';
// import { Badge } from '@/components/core/Badge';
// import { Button } from '@/components/core/Button';
// import { UploadDropzone } from '@/components/core/Inputs/File';
// import { Stack } from '@/components/core/Stack';
// import SortableGallery from '@/components/escorts/SortableGallery';
// import type { ProfileData, profile } from '@/queries/profile';
// import {
// 	deleteFile,
// 	type GalleryItem,
// 	toGalleryItems,
// 	uploadFile,
// } from '@/queries/uploadFile';

// interface Props {
// 	id: string;
// 	data?: ProfileData;
// 	onSubmit?: ReturnType<typeof profile.update.useMutation>;
// }
// export const GalleryTab = ({ id, data, onSubmit }: Props) => {
// 	const { control } = useUploadFiles({
// 		route: 'gallery',
// 	});

// 	const [errorMsg] = useState<string | null>(null);
// 	const MAX_FILES = 4;
// 	const MAX_SIZE = 2 * 1024 * 1024; // 2MB

// 	// previews removido: upload agora é imediato (sem blobs locais);

// 	const existing = useMemo(() => {
// 		const g: any = data?.gallery ?? [];
// 		const items = Array.isArray(g) ? g : g?.items;
// 		return Array.isArray(items) ? items : [];
// 	}, [data]);

// 	// Estado local das imagens salvas (fonte de verdade da UI)
// 	const [items, setItems] = useState<GalleryItem[]>([]);
// 	useEffect(() => {
// 		setItems(existing);
// 	}, [existing]);

// 	// Itens exibidos para o DnD (apenas salvos)
// 	type DisplayItem = { kind: 'saved'; key: string; url: string; id: string };

// 	const display: DisplayItem[] = useMemo(
// 		() =>
// 			items.map((it) => ({
// 				kind: 'saved',
// 				key: `saved:${it.id}`,
// 				id: String(it.id),
// 				url: String(it.url),
// 			})),
// 		[items],
// 	);

// 	const [order, setOrder] = useState<string[]>([]);

// 	useEffect(() => {
// 		setOrder(display.map((d) => d.key));
// 	}, [display]);

// 	const handleFilesAdded = async (input: File[] | FileList) => {
// 		const incoming = Array.isArray(input) ? input : Array.from(input);
// 		const allowed = incoming.filter((f) => f.size <= MAX_SIZE);
// 		const available = Math.max(0, MAX_FILES - items.length);
// 		const toUpload = allowed.slice(0, available);
// 		if (!toUpload.length) return;

// 		// Upload imediato item-a-item com placeholder visual
// 		for (const file of toUpload) {
// 			// placeholder (poderíamos marcar uploading com outro shape se necessário)
// 			const tempId = `temp-${crypto.randomUUID()}`;
// 			const blobUrl = URL.createObjectURL(file);
// 			const tempItem: GalleryItem = {
// 				id: tempId,
// 				path: '',
// 				url: blobUrl,
// 				size: file.size,
// 				width: 0,
// 				height: 0,
// 				order: items.length,
// 				createdAt: new Date().toISOString(),
// 			};
// 			setItems((prev) => {
// 				const next = [...prev, tempItem].map((it, i) => ({ ...it, order: i }));
// 				setOrder(next.map((it) => `saved:${it.id}`));
// 				return next;
// 			});

// 			try {
// 				const meta = await uploadFile(id, file);
// 				const real = toGalleryItems([meta])[0];
// 				setItems((prev) => {
// 					const idx = prev.findIndex((it) => it.id === tempId);
// 					if (idx === -1) return prev;
// 					const next = [...prev];
// 					next[idx] = { ...real, order: idx } as GalleryItem;
// 					const reindexed = next.map((it, i) => ({ ...it, order: i }));
// 					setOrder(reindexed.map((it) => `saved:${it.id}`));
// 					return reindexed;
// 				});
// 				URL.revokeObjectURL(blobUrl);
// 				// persiste snapshot atual
// 				setItems((prev) => {
// 					void onSubmit?.mutateAsync({ id, gallery: prev });
// 					return prev;
// 				});
// 			} catch {
// 				URL.revokeObjectURL(blobUrl);
// 				setItems((prev) => {
// 					const next = prev
// 						.filter((it) => it.id !== tempId)
// 						.map((it, i) => ({ ...it, order: i }));
// 					setOrder(next.map((it) => `saved:${it.id}`));
// 					return next;
// 				});
// 			}
// 		}
// 	};

// 	const handleRemove = async (key: string) => {
// 		if (!key.startsWith('saved:')) return;
// 		const item = items.find((it) => `saved:${it.id}` === key);
// 		if (!item) return;
// 		await deleteFile(item.path);
// 		const nextItems = items
// 			.filter((it) => `saved:${it.id}` !== key)
// 			.map((it, i) => ({ ...it, order: i }));
// 		setItems(nextItems);
// 		setOrder(nextItems.map((it) => `saved:${it.id}`));
// 		await onSubmit?.mutateAsync({ id, gallery: nextItems });
// 	};

// 	const handleSave = async () => {
// 		const nextItems = order
// 			.map((k, i) => {
// 				const found = items.find((it) => `saved:${it.id}` === k);
// 				return found ? { ...found, order: i } : null;
// 			})
// 			.filter(Boolean) as GalleryItem[];
// 		setItems(nextItems);
// 		await onSubmit?.mutateAsync({ id, gallery: nextItems });
// 	};

// 	return (
// 		<Stack className="gap-5">
// 			<Badge>
// 				<Badge.Text>Imagens</Badge.Text>
// 			</Badge>

// 			<Stack className="gap-3">
// 				<UploadDropzone
// 					control={control}
// 					accept="image/*"
// 					metadata={{
// 						profile_id: id,
// 					}}
// 					description={{
// 						maxFiles: 4,
// 						maxFileSize: '2MB',
// 						fileTypes: 'JPEG, PNG, GIF',
// 					}}
// 					uploadOverride={handleFilesAdded}
// 				/>

// 				<SortableGallery
// 					items={display}
// 					order={order}
// 					onOrderChange={setOrder}
// 					onRemoveNew={handleRemove}
// 					onRemoveSaved={handleRemove}
// 				/>

// 				{errorMsg ? <p className="text-danger text-sm">{errorMsg}</p> : null}

// 				<Button onClick={handleSave} disabled={!order.length}>
// 					<Button.Text>Salvar</Button.Text>
// 				</Button>
// 			</Stack>
// 		</Stack>
// 	);
// };
