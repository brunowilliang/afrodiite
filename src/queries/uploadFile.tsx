import { api } from '@/lib/api/client';

export type GalleryItem = {
	id: string;
	path: string;
	url: string;
	size: number;
	width: number;
	height: number;
	order: number;
	createdAt: string;
};

export type Gallery = { items: GalleryItem[] };

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ALLOWED_IMAGE_TYPES = new Set([
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
]);

export type UploadedImageMeta = {
	path: string;
	url: string;
	size: number;
	width: number;
	height: number;
};

export async function uploadFile(
	profileId: string,
	file: File,
): Promise<UploadedImageMeta> {
	if (!file.type || !file.type.startsWith('image/')) {
		throw new Error('Arquivo inválido: apenas imagens são permitidas');
	}
	if (file.size > MAX_FILE_SIZE) {
		throw new Error('Tamanho máximo permitido é 2MB');
	}
	// Opcional: filtrar por MIME conhecido
	if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
		// ainda permitimos se vier um image/* válido mas desconhecido
		// comente/descomente se quiser bloquear estritamente
		// throw new Error('Formato de imagem não suportado');
	}

	const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
	const path = `${profileId}/${crypto.randomUUID()}.${ext}`;

	const { data, error } = await api.supabase.storage
		.from('escort-gallery')
		.upload(path, file, {
			cacheControl: '3600',
			contentType: file.type || `image/${ext}`,
			upsert: false,
		});

	console.log({ data, error });
	if (error) throw error;

	const { data: pub } = api.supabase.storage
		.from('escort-gallery')
		.getPublicUrl(path);
	const { width, height } = await getImageDims(file);

	return { path, url: pub.publicUrl, size: file.size, width, height };
}

function getImageDims(file: File): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve({ width: img.naturalWidth, height: img.naturalHeight });
		};
		img.onerror = (e) => {
			URL.revokeObjectURL(url);
			reject(e);
		};
		img.src = url;
	});
}

export async function uploadMany(profileId: string, files: File[]) {
	const settled = await Promise.allSettled(
		files.map((f) => uploadFile(profileId, f)),
	);
	const ok = settled
		.filter((s) => s.status === 'fulfilled')
		.map((s) => (s as PromiseFulfilledResult<UploadedImageMeta>).value);
	const errs = settled.filter(
		(s) => s.status === 'rejected',
	) as PromiseRejectedResult[];
	return { ok, errs };
}

export function toGalleryItems(uploaded: UploadedImageMeta[]): GalleryItem[] {
	const now = new Date().toISOString();
	return uploaded.map((u, i) => ({
		id: crypto.randomUUID(),
		path: u.path,
		url: u.url,
		size: u.size,
		width: u.width,
		height: u.height,
		order: i,
		createdAt: now,
	}));
}

export async function deleteFile(path: string) {
	const { error } = await api.supabase.storage
		.from('escort-gallery')
		.remove([path]);
	if (error) throw error;
}
