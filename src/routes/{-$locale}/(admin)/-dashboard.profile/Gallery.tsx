//
import { useUploadFiles } from 'better-upload/client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
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
	const [isSaving, setIsSaving] = useState(false);
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

	const handleFilesAdded = (input: File[] | FileList) => {
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

		setItems((prev) => [...prev, ...newItems]);
		setOrder((prev) => [...prev, ...newItems.map((n) => n.id)]);
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

	const handleSave = async () => {
		// Local items in current order
		const localIds = order.filter((id) => id.startsWith('local-'));
		const files: File[] = localIds
			.map((id) => localFilesRef.current.get(id))
			.filter((f): f is File => !!f);

		if (files.length === 0) return;

		setIsSaving(true);
		const { ok } = await uploadMany(id, files);
		const uploaded = toGalleryItems(ok);

		// Reconciliar com a ordem atual
		let upIdx = 0;
		const final: GalleryItem[] = order.map((oid, idx) => {
			if (oid.startsWith('local-')) {
				const u = uploaded[upIdx++];
				// Preserve original local id to avoid remount/flicker
				return { ...u, id: oid, order: idx };
			}
			const existing = items.find((it) => it.id === oid);
			return existing
				? { ...existing, order: idx }
				: ({
						id: oid,
						path: '',
						url: '',
						size: 0,
						width: 0,
						height: 0,
						order: idx,
						createdAt: new Date().toISOString(),
					} as GalleryItem);
		});

		// Pré-carregar imagens remotas para evitar flicker ao trocar src
		const preload = (url: string) =>
			new Promise<void>((resolve) => {
				const img = new Image();
				img.onload = () => resolve();
				img.onerror = () => resolve();
				img.src = url;
			});
		await Promise.all(final.map((it) => preload(it.url)));

		// Revogar blobs antigos e limpar refs locais
		items.forEach((it) => {
			if (it.id.startsWith('local-') && it.url.startsWith('blob:')) {
				try {
					URL.revokeObjectURL(it.url);
				} catch {}
			}
		});
		localFilesRef.current.clear();

		setItems(final);
		setOrder(final.map((it) => String(it.id)));

		// Persistir no banco via onSubmit da tela principal
		try {
			await onSubmit.mutateAsync({ id, gallery: final });
		} finally {
			setIsSaving(false);
		}
	};

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
				<div className="flex justify-end">
					<Button onClick={handleSave} disabled={!order.length || isSaving}>
						<Button.Text>{isSaving ? 'Salvando...' : 'Salvar'}</Button.Text>
					</Button>
				</div>
			</Stack>
		</Stack>
	);
};
