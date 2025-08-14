// import { useUploadFiles } from 'better-upload/client';
// import { useEffect, useMemo, useRef, useState } from 'react';
// import { toast } from 'sonner';
// import type { GalleryItem } from '@/api/defaults/escort';
// import type { ProfileRow } from '@/api/types/escort';
// import { Badge } from '@/components/core/Badge';
// import { UploadDropzone } from '@/components/core/Inputs/File';
// import { Stack } from '@/components/core/Stack';
// import { SortableGallery } from '@/components/dashboard/SortableGallery';
// import type { profile } from '@/queries/profile';
// import { deleteFile, toGalleryItems, uploadFile } from '@/queries/uploadFile';

// interface Props {
// 	id: string;
// 	data?: Partial<ProfileRow>;
// 	onSubmit: ReturnType<typeof profile.update.useMutation>;
// }
// export const GalleryTab = ({ id, onSubmit, data }: Props) => {
// 	const { control } = useUploadFiles({
// 		route: 'gallery',
// 	});

// 	// removed unused local error state; using toast instead

// 	// controls quick disable states while uploading
// 	const [, setIsSaving] = useState(false);
// 	const [progress, setProgress] = useState<Map<string, number>>(new Map());
// 	const MAX_FILES = 10;
// 	const MAX_SIZE = 2 * 1024 * 1024; // 2MB

// 	// Estado local dos itens (apenas sessão)
// 	const [items, setItems] = useState<GalleryItem[]>([]);

// 	const display = items
// 		.filter((it) => typeof it.url === 'string' && it.url.length > 0)
// 		.map((it) => ({
// 			kind: 'saved' as const,
// 			key: String(it.id),
// 			id: String(it.id),
// 			url: it.url,
// 		}));

// 	const order = useMemo(() => items.map((i) => String(i.id)), [items]);
// 	const localFilesRef = useRef<Map<string, File>>(new Map());

// 	const reindex = (arr: GalleryItem[]): GalleryItem[] =>
// 		arr.map((it, idx) => ({ ...it, order: idx }));

// 	// Hidratar a partir do servidor apenas na inicialização (ou troca de id)
// 	useEffect(() => {
// 		const g: any = data?.gallery ?? [];
// 		const serverItems: GalleryItem[] = Array.isArray(g) ? g : (g?.items ?? []);
// 		if (!items.length && Array.isArray(serverItems) && serverItems.length) {
// 			const normalized = serverItems.slice().sort((a, b) => a.order - b.order);
// 			setItems(normalized);
// 		}
// 	}, [id, data]);

// 	// order é derivado de items

// 	const preloadImage = (url: string) =>
// 		new Promise<void>((resolve) => {
// 			const img = new Image();
// 			img.onload = () => resolve();
// 			img.onerror = () => resolve();
// 			img.src = url;
// 		});

// 	const persistProfileSafe = async (finalItems: GalleryItem[]) => {
// 		const toPersist = finalItems.filter(
// 			(it) =>
// 				!!it.path && typeof it.url === 'string' && !it.url.startsWith('blob:'),
// 		);
// 		if (toPersist.length) {
// 			await onSubmit.mutateAsync({ id, gallery: toPersist });
// 		}
// 	};

// 	const handleFilesAdded = async (input: File[] | FileList) => {
// 		const incoming = Array.isArray(input) ? input : Array.from(input);
// 		const tooBig = incoming.filter((f) => f.size > MAX_SIZE);
// 		if (tooBig.length) {
// 			toast.error('Arquivo acima de 2MB não permitido', {
// 				description: `${tooBig.length} arquivo(s) foram ignorados por exceder 2MB`,
// 			});
// 		}
// 		const allowed = incoming.filter((f) => f.size <= MAX_SIZE);
// 		const available = Math.max(0, MAX_FILES - items.length);
// 		const toAdd = allowed.slice(0, available);
// 		if (!toAdd.length) return;

// 		const newItems: GalleryItem[] = toAdd.map((file, idx) => {
// 			const localId = `local-${crypto.randomUUID()}`;
// 			localFilesRef.current.set(localId, file);
// 			return {
// 				id: localId,
// 				path: '',
// 				url: URL.createObjectURL(file),
// 				size: file.size,
// 				width: 0,
// 				height: 0,
// 				order: items.length + idx,
// 				createdAt: new Date().toISOString(),
// 			};
// 		});

// 		// Otimismo imediato
// 		setItems((prev) => [...prev, ...newItems]);
// 		const newIds = newItems.map((n) => n.id);
// 		const nextOrder = [...order, ...newIds];
// 		// progresso inicial por item
// 		setProgress((prev) => {
// 			const map = new Map(prev);
// 			newIds.forEach((id) => map.set(id, 0.1));
// 			return map;
// 		});

// 		// Upload e persistência imediatos
// 		try {
// 			setIsSaving(true);
// 			const files = newIds
// 				.map((id) => localFilesRef.current.get(id))
// 				.filter((f): f is File => !!f);
// 			// coletar sucessos mantendo associação lid -> meta
// 			const successes: Array<{
// 				lid: string;
// 				meta: import('@/queries/uploadFile').UploadedImageMeta;
// 			}> = [];
// 			await Promise.all(
// 				newIds.map(async (lid, i) => {
// 					const file = files[i];
// 					if (!file) return;
// 					try {
// 						const meta = await uploadFile(id, file);
// 						setProgress((prev) => {
// 							const map = new Map(prev);
// 							map.set(lid, 0.8);
// 							return map;
// 						});
// 						successes.push({ lid, meta });
// 					} catch {
// 						// mantém item local (blob) visível; sem progresso
// 					}
// 				}),
// 			);
// 			const uploaded = toGalleryItems(successes.map((s) => s.meta));

// 			// mapear cada localId -> gallery item uploaded (ordem preservada dentro dos sucessos)
// 			const idToUploaded = new Map<string, GalleryItem>();
// 			uploaded.forEach((u, i) => {
// 				const pair = successes[i];
// 				if (pair) idToUploaded.set(pair.lid, u);
// 			});

// 			const baseItems = [...items, ...newItems];

// 			const final: GalleryItem[] = [];
// 			for (let i = 0; i < nextOrder.length; i++) {
// 				const oid = nextOrder[i];
// 				const up = idToUploaded.get(oid);
// 				if (up) {
// 					final.push({ ...up, id: oid, order: i });
// 				} else {
// 					const ex = baseItems.find((it) => it.id === oid);
// 					if (ex) final.push({ ...ex, order: i });
// 				}
// 			}

// 			// Preload apenas das imagens remotas que subiram
// 			await Promise.all(uploaded.map((it) => preloadImage(it.url)));
// 			// progresso de preload
// 			setProgress((prev) => {
// 				const map = new Map(prev);
// 				successes.forEach(({ lid }) => {
// 					map.set(lid, 0.95);
// 				});
// 				return map;
// 			});

// 			// Revogar blobs dos que subiram e limpar refs
// 			newItems.forEach((ni) => {
// 				if (ni.url.startsWith('blob:')) {
// 					try {
// 						URL.revokeObjectURL(ni.url);
// 					} catch {}
// 				}
// 				localFilesRef.current.delete(ni.id);
// 			});

// 			setItems(reindex(final));

// 			await persistProfileSafe(final);
// 			// concluir progresso e limpar
// 			setProgress((prev) => {
// 				const map = new Map(prev);
// 				newIds.forEach((lid) => map.delete(lid));
// 				return map;
// 			});
// 		} finally {
// 			setIsSaving(false);
// 		}
// 	};

// 	const handleRemove = async (key: string) => {
// 		const target = items.find((it) => it.id === key);
// 		if (
// 			target &&
// 			typeof target.url === 'string' &&
// 			target.url.startsWith('blob:')
// 		) {
// 			try {
// 				URL.revokeObjectURL(target.url);
// 			} catch {}
// 		}
// 		// Se for item salvo, remover do storage e persistir no perfil
// 		if (target?.path && !target?.url?.startsWith('blob:')) {
// 			try {
// 				await deleteFile(target.path);
// 			} catch {
// 				// noop
// 			}
// 		}
// 		localFilesRef.current.delete(key);
// 		const nextItems = reindex(items.filter((it) => it.id !== key));
// 		setItems(nextItems);
// 		// Persistir remoção no perfil
// 		try {
// 			await onSubmit.mutateAsync({ id, gallery: nextItems });
// 		} catch {
// 			// noop
// 		}
// 	};

// 	return (
// 		<Stack className="gap-5">
// 			<Badge>
// 				<Badge.Text>Imagens</Badge.Text>
// 			</Badge>

// 			<Stack className="gap-3">
// 				{items.length < MAX_FILES && (
// 					<UploadDropzone
// 						control={control}
// 						accept="image/*"
// 						metadata={{
// 							profile_id: id,
// 						}}
// 						description={{
// 							maxFiles: MAX_FILES,
// 							maxFileSize: `${MAX_SIZE / 1024 / 1024}MB`,
// 							fileTypes: 'JPEG, PNG',
// 						}}
// 						uploadOverride={handleFilesAdded}
// 					/>
// 				)}

// 				<SortableGallery
// 					items={display}
// 					order={order}
// 					progress={progress}
// 					disabled={progress.size > 0}
// 					onOrderChange={async (next) => {
// 						const ordered = next
// 							.map((oid) => items.find((it) => it.id === oid) || null)
// 							.filter(Boolean) as GalleryItem[];
// 						const nextItems = reindex(ordered);
// 						setItems(nextItems);
// 						const toPersist = nextItems.filter(
// 							(it) =>
// 								!!it.path &&
// 								typeof it.url === 'string' &&
// 								!it.url.startsWith('blob:'),
// 						);
// 						try {
// 							await onSubmit.mutateAsync({ id, gallery: toPersist });
// 						} catch {}
// 					}}
// 					onDelete={handleRemove}
// 				/>
// 			</Stack>
// 		</Stack>
// 	);
// };
