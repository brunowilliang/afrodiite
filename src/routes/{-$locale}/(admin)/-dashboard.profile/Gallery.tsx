import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { useUploadFiles } from 'better-upload/client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
	deleteFile,
	MAX_FILE_SIZE,
	toGalleryItems,
	uploadFile,
} from '@/api/http/routes/uploadFile';
import type { GalleryItem } from '@/api/utils/types/escort';
import { Stack } from '@/components/core/Stack';
import { SortableGallery } from '@/components/dashboard/SortableGallery';
import { Input } from '@/components/heroui/Input';
import { api } from '@/lib/api';

export const GalleryTab = () => {
	const { control } = useUploadFiles({ route: 'gallery' });

	const router = useRouter();
	const { session, profile } = useRouteContext({ from: '/{-$locale}' });
	const id = session?.user.id as string;

	const updateProfile = useMutation(
		api.queries.profile.update.mutationOptions(),
	);

	const [isSaving, setIsSaving] = useState(false);
	const [progress, setProgress] = useState<Map<string, number>>(new Map());
	const MAX_FILES = 10;
	const MAX_SIZE = MAX_FILE_SIZE;

	const [items, setItems] = useState<GalleryItem[]>([]);

	const display = items
		.filter((it) => typeof it.url === 'string' && it.url.length > 0)
		.map((it) => ({
			kind: 'saved' as const,
			key: String(it.id),
			id: String(it.id),
			url: it.url,
		}));

	const order = useMemo(() => items.map((i) => String(i.id)), [items]);
	const localFilesRef = useRef<Map<string, File>>(new Map());

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

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
			await updateProfile.mutateAsync({ id, gallery: toPersist } as any);
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
			(f) => f.size <= MAX_SIZE && f.type.startsWith('image/'),
		);
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
		const newIds = newItems.map((n) => n.id as string);
		const nextOrder = [...order, ...newIds];
		setProgress((prev) => {
			const map = new Map(prev);
			newIds.forEach((id) => map.set(id, 0.1));
			return map;
		});

		try {
			setIsSaving(true);
			const files = newIds
				.map((id) => localFilesRef.current.get(id))
				.filter((f): f is File => !!f);
			const successes: Array<{ lid: string; meta: any }> = [];

			await Promise.all(
				newIds.map(async (lid, i) => {
					const file = files[i];
					if (!file) return;
					try {
						const meta = await uploadFile(id, file);
						setProgress((prev) => {
							const map = new Map(prev);
							map.set(lid, 0.8);
							return map;
						});
						successes.push({ lid, meta });
					} catch {}
				}),
			);

			const uploaded = toGalleryItems(successes.map((s) => s.meta));
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
				if (up) final.push({ ...up, id: oid, order: i });
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
				newIds.forEach((lid) => map.delete(lid));
				return map;
			});
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
		if (target?.path && !target?.url?.startsWith('blob:')) {
			try {
				await deleteFile(target.path);
			} catch {}
		}
		localFilesRef.current.delete(key);
		const nextItems = reindex(items.filter((it) => it.id !== key));
		setItems(nextItems);
		try {
			await updateProfile.mutateAsync({ id, gallery: nextItems } as any);
		} catch {}
	};

	return (
		<Stack className="gap-3">
			{items.length < MAX_FILES && (
				<Input.File
					control={control}
					accept="image/*"
					metadata={{ profile_id: id }}
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
					try {
						await updateProfile.mutateAsync({
							id,
							gallery: toPersist,
						} as any);
					} catch {}
				}}
				onDelete={handleRemove}
			/>
		</Stack>
	);
};
