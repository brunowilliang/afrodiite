'use client';

import { useServerAction } from '@orpc/react/hooks';
import { useUploadFiles } from 'better-upload/client';
import { nanoid } from 'nanoid';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MAX_FILE_SIZE_GALLERY } from '@/api/http/routes/storage';
import { buildGalleryItems } from '@/api/utils/buildGalleryItems';
import type { GalleryItem } from '@/api/utils/schemas/escort-core';
import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Input } from '@/components/core/Input';
import { Stack } from '@/components/core/Stack';
import { toast } from '@/components/core/Toast';
import { SortableGallery } from '@/components/SortableGallery';
import { api } from '@/lib/orpc';
import { tryCatch } from '@/utils/tryCatch';
import { updateProfile } from './actions/updateProfile';

type Props = {
	profile?: IProfile.Select;
};

export const Gallery = ({ profile }: Props) => {
	const { control } = useUploadFiles({ route: 'gallery' });
	const { execute } = useServerAction(updateProfile);

	const [isSaving, setIsSaving] = useState(false);
	const [progress, setProgress] = useState<Map<string, number>>(new Map());
	const MAX_FILES = 10;
	const MAX_SIZE = MAX_FILE_SIZE_GALLERY;
	const ALLOWED_MIME = new Set(['image/jpeg', 'image/png']);

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

	const order = useMemo(() => items.map((i) => String(i.id)), [items]);
	const localFilesRef = useRef<Map<string, File>>(new Map());
	const reorderTimerRef = useRef<number | undefined>(undefined);

	const reindex = (arr: GalleryItem[]): GalleryItem[] =>
		arr.map((it, idx) => ({ ...it, order: idx }));

	useEffect(() => {
		const serverItems: GalleryItem[] = Array.isArray(profile?.gallery)
			? (profile?.gallery as GalleryItem[])
			: [];
		if (!items.length && serverItems.length) {
			const normalized = serverItems.slice().sort((a, b) => a.order - b.order);
			setItems(normalized);
		}
	}, [profile?.id]);

	const preloadImage = (url: string) =>
		new Promise<void>((resolve) => {
			const img = new Image();
			img.onload = () => resolve();
			img.onerror = () => resolve();
			img.src = url;
		});

	const persistProfileSafe = async (finalItems: GalleryItem[]) => {
		const toPersist = finalItems.filter(
			(it) =>
				!!it.path && typeof it.url === 'string' && !it.url.startsWith('blob:'),
		);
		if (toPersist.length) {
			const [error] = await execute({ gallery: toPersist } as IProfile.Update);
			if (error) {
				toast.error(error?.message ?? 'Erro ao salvar galeria');
			}
		}
	};

	const handleFilesAdded = async (input: File[] | FileList) => {
		const incoming = Array.isArray(input) ? input : Array.from(input);
		const tooBig = incoming.filter((f) => f.size > MAX_SIZE);
		if (tooBig.length) {
			toast.error('Arquivo acima de 2MB não permitido', {
				description: `${tooBig.length} arquivo(s) foram ignorados por exceder 2MB`,
			});
		}
		const allowed = incoming.filter(
			(f) => f.size <= MAX_SIZE && ALLOWED_MIME.has(f.type),
		);
		const available = Math.max(0, MAX_FILES - items.length);
		const toAdd = allowed.slice(0, available);
		if (!toAdd.length) return;

		const newItems: GalleryItem[] = toAdd.map((file, idx) => {
			const fileId = nanoid(6);
			localFilesRef.current.set(fileId, file);
			return {
				id: fileId,
				path: '',
				url: URL.createObjectURL(file),
				size: file.size,
				order: items.length + idx,
				createdAt: new Date().toISOString(),
			};
		});

		setItems((prev) => [...prev, ...newItems]);
		const newIds = newItems.map((n) => n.id as string);
		const nextOrder = [...order, ...newIds];
		setProgress((prev) => {
			const map = new Map(prev);
			newIds.forEach((fileId) => map.set(fileId, 0.1));
			return map;
		});

		setIsSaving(true);
		const successes: Array<{
			lid: string;
			meta: Partial<GalleryItem>;
		}> = [];

		await Promise.all(
			newIds.map(async (fileId) => {
				const file = localFilesRef.current.get(fileId);
				if (!file) return;

				const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
				const key = `${profile?.id}/${fileId}.${ext}`;

				const [presignErr, presign] = await tryCatch(
					api.orpc.storage.upload({
						bucket: 'escort-gallery',
						key,
						file,
					}),
				);
				if (presignErr || !presign) return;

				// 2) Create gallery item metadata (no more width/height)
				const meta = {
					id: fileId,
					path: presign.key,
					url: presign.url,
					size: file.size,
				};

				setProgress((prev) => {
					const map = new Map(prev);
					map.set(fileId, 0.8);
					return map;
				});

				successes.push({ lid: fileId, meta });
			}),
		);

		const uploaded = buildGalleryItems(successes.map((s) => s.meta));
		const idToUploaded = new Map<string, GalleryItem>();
		uploaded.forEach((u, i) => {
			const pair = successes[i];
			if (pair) idToUploaded.set(pair.lid, u);
		});

		const baseItems = [...items, ...newItems];
		const final: GalleryItem[] = [];
		for (let i = 0; i < nextOrder.length; i++) {
			const oid = nextOrder[i];
			const up = idToUploaded.get(oid);
			if (up)
				final.push({ ...up, order: i }); // Keep original ID, just update order
			else {
				const ex = baseItems.find((it) => it.id === oid);
				if (ex) final.push({ ...ex, order: i });
			}
		}

		await Promise.all(uploaded.map((it) => preloadImage(it.url)));
		setProgress((prev) => {
			const map = new Map(prev);
			successes.forEach(({ lid }) => map.set(lid, 0.95));
			return map;
		});

		newItems.forEach((ni) => {
			if (ni.url.startsWith('blob:')) {
				try {
					URL.revokeObjectURL(ni.url);
				} catch {}
			}
			localFilesRef.current.delete(ni.id);
		});

		setItems(reindex(final));
		await persistProfileSafe(final);
		setProgress((prev) => {
			const map = new Map(prev);
			newIds.forEach((fileId) => map.delete(fileId));
			return map;
		});
		setIsSaving(false);
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
		if (target?.path && !target?.url?.startsWith('blob:')) {
			await tryCatch(
				api.orpc.storage.delete({
					bucket: 'escort-gallery',
					key: target.path,
				}),
			);
		}
		localFilesRef.current.delete(key);
		const nextItems = reindex(items.filter((it) => it.id !== key));
		setItems(nextItems);

		const [error] = await execute({ gallery: nextItems } as IProfile.Update);
		if (error) {
			toast.error(error?.message ?? 'Erro ao remover galeria');
		}
	};

	return (
		<Stack className="gap-3">
			{items.length < MAX_FILES && (
				<Input.File
					control={control}
					accept="image/*"
					metadata={{ profile_id: profile?.id }}
					description={{
						maxFiles: MAX_FILES,
						maxFileSize: `${MAX_SIZE / 1024 / 1024}MB`,
						fileTypes: 'JPEG, PNG, WEBP, GIF',
					}}
					uploadOverride={handleFilesAdded}
				/>
			)}

			<SortableGallery
				items={display}
				order={order}
				progress={progress}
				disabled={progress.size > 0 || isSaving}
				onOrderChange={async (next) => {
					const ordered = next
						.map((oid) => items.find((it) => it.id === oid) || null)
						.filter(Boolean) as GalleryItem[];
					const nextItems = reindex(ordered);
					setItems(nextItems);
					const toPersist = nextItems.filter(
						(it) =>
							!!it.path &&
							typeof it.url === 'string' &&
							!it.url.startsWith('blob:'),
					);
					// debounce persist to avoid multiple sequential updates
					if (!reorderTimerRef.current) {
						reorderTimerRef.current = undefined;
					}
					if (reorderTimerRef.current) {
						clearTimeout(reorderTimerRef.current);
					}
					reorderTimerRef.current = setTimeout(async () => {
						const [error] = await execute({
							gallery: toPersist,
						} as IProfile.Update);
						if (error) {
							toast.error(error?.message ?? 'Erro ao reordenar galeria');
						}
					}, 400) as unknown as number;
				}}
				onDelete={handleRemove}
			/>
		</Stack>
	);
};
