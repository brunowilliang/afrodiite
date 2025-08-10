//
import { useUploadFiles } from 'better-upload/client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/core/Badge';
import { UploadDropzone } from '@/components/core/Inputs/File';
import { Stack } from '@/components/core/Stack';
import SortableGallery from '@/components/escorts/SortableGallery';
import type { ProfileData, profile } from '@/queries/profile';
import {
	deleteFile,
	type GalleryItem,
	toGalleryItems,
	uploadMany,
} from '@/queries/uploadFile';

interface Props {
	id: string;
	data: ProfileData;
	onSubmit: ReturnType<typeof profile.update.useMutation>;
}
export const GalleryTab = ({ id, onSubmit, data }: Props) => {
	const { control } = useUploadFiles({
		route: 'gallery',
	});

	const [errorMsg] = useState<string | null>(null);
	// controls quick disable states while uploading
	const [, setIsSaving] = useState(false);
	const MAX_FILES = 4;
	const MAX_SIZE = 2 * 1024 * 1024; // 2MB

	// Estado local dos itens (apenas sessão)
	const [items, setItems] = useState<GalleryItem[]>([]);

	const display = useMemo(
		() =>
			items
				.filter((it) => typeof it.url === 'string' && it.url.length > 0)
				.map((it) => ({
					kind: 'saved' as const,
					key: String(it.id),
					id: String(it.id),
					url: it.url,
				})),
		[items],
	);

	const [order, setOrder] = useState<string[]>([]);
	const localFilesRef = useRef<Map<string, File>>(new Map());

	// Hidratar a partir do servidor apenas na inicialização (ou troca de id)
	useEffect(() => {
		const g: any = data?.gallery ?? [];
		const serverItems: GalleryItem[] = Array.isArray(g) ? g : (g?.items ?? []);
		if (!items.length && Array.isArray(serverItems) && serverItems.length) {
			const normalized = serverItems.slice().sort((a, b) => a.order - b.order);
			setItems(normalized);
		}
	}, [id, data]);

	useEffect(() => {
		setOrder(display.map((d) => d.key));
	}, [display]);

	const handleFilesAdded = async (input: File[] | FileList) => {
		const incoming = Array.isArray(input) ? input : Array.from(input);
		const allowed = incoming.filter((f) => f.size <= MAX_SIZE);
		const available = Math.max(0, MAX_FILES - items.length);
		const toAdd = allowed.slice(0, available);
		if (!toAdd.length) return;

		const newItems: GalleryItem[] = toAdd.map((file, idx) => {
			const localId = `local-${crypto.randomUUID()}`;
			localFilesRef.current.set(localId, file);
			return {
				id: localId,
				path: '',
				url: URL.createObjectURL(file),
				size: file.size,
				width: 0,
				height: 0,
				order: items.length + idx,
				createdAt: new Date().toISOString(),
			};
		});

		// Otimismo imediato
		setItems((prev) => [...prev, ...newItems]);
		const newIds = newItems.map((n) => n.id);
		const nextOrder = [...order, ...newIds];
		setOrder(nextOrder);

		// Upload e persistência imediatos
		try {
			setIsSaving(true);
			const files = newIds
				.map((id) => localFilesRef.current.get(id))
				.filter((f): f is File => !!f);
			const { ok } = await uploadMany(id, files);
			const uploaded = toGalleryItems(ok);

			// mapear cada localId -> meta uploaded correspondente (ordem preservada)
			const idToUploaded = new Map<string, GalleryItem>();
			uploaded.forEach((u, i) => {
				const lid = newIds[i];
				if (lid) idToUploaded.set(lid, u);
			});

			const baseItems = [...items, ...newItems];
			// Pré-carregar imagens remotas
			const preload = (url: string) =>
				new Promise<void>((resolve) => {
					const img = new Image();
					img.onload = () => resolve();
					img.onerror = () => resolve();
					img.src = url;
				});

			const final: GalleryItem[] = [];
			for (let i = 0; i < nextOrder.length; i++) {
				const oid = nextOrder[i];
				const up = idToUploaded.get(oid);
				if (up) {
					final.push({ ...up, id: oid, order: i });
				} else {
					const ex = baseItems.find((it) => it.id === oid);
					if (ex) final.push({ ...ex, order: i });
				}
			}

			await Promise.all(final.map((it) => preload(it.url)));

			// Revogar blobs dos que subiram e limpar refs
			newItems.forEach((ni) => {
				if (ni.url.startsWith('blob:')) {
					try {
						URL.revokeObjectURL(ni.url);
					} catch {}
				}
				localFilesRef.current.delete(ni.id);
			});

			setItems(final);
			setOrder(final.map((it) => it.id));

			const toPersist = final.filter(
				(it) =>
					!!it.path &&
					typeof it.url === 'string' &&
					!it.url.startsWith('blob:'),
			);
			await onSubmit.mutateAsync({ id, gallery: toPersist });
		} finally {
			setIsSaving(false);
		}
	};

	const handleRemove = async (key: string) => {
		const target = items.find((it) => it.id === key);
		if (
			target &&
			typeof target.url === 'string' &&
			target.url.startsWith('blob:')
		) {
			try {
				URL.revokeObjectURL(target.url);
			} catch {}
		}
		// Se for item salvo, remover do storage e persistir no perfil
		if (target?.path && !target?.url?.startsWith('blob:')) {
			try {
				await deleteFile(target.path);
			} catch {
				// noop
			}
		}
		localFilesRef.current.delete(key);
		const nextItems = items.filter((it) => it.id !== key);
		setItems(nextItems);
		setOrder(order.filter((k) => k !== key));
		// Persistir remoção no perfil
		try {
			await onSubmit.mutateAsync({ id, gallery: nextItems });
		} catch {
			// noop
		}
	};

	// removed explicit save, uploads persist on drop

	return (
		<Stack className="gap-5">
			<Badge>
				<Badge.Text>Imagens</Badge.Text>
			</Badge>

			<Stack className="gap-3">
				<UploadDropzone
					control={control}
					accept="image/*"
					metadata={{
						profile_id: id,
					}}
					description={{
						maxFiles: 4,
						maxFileSize: '2MB',
						fileTypes: 'JPEG, PNG, GIF',
					}}
					uploadOverride={handleFilesAdded}
				/>

				<SortableGallery
					items={display}
					order={order}
					onOrderChange={async (next) => {
						setOrder(next);
						const nextItems: GalleryItem[] = next
							.map((oid, idx) => {
								const f = items.find((it) => it.id === oid);
								return f ? { ...f, order: idx } : null;
							})
							.filter(Boolean) as GalleryItem[];
						setItems(nextItems);
						const toPersist = nextItems.filter(
							(it) =>
								!!it.path &&
								typeof it.url === 'string' &&
								!it.url.startsWith('blob:'),
						);
						try {
							await onSubmit.mutateAsync({ id, gallery: toPersist });
						} catch {}
					}}
					onDelete={handleRemove}
				/>

				{errorMsg ? <p className="text-danger text-sm">{errorMsg}</p> : null}
			</Stack>
		</Stack>
	);
};
