import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { z } from 'zod';
import { authProcedure } from '@/api/http/middlewares';
import { r2 } from '@/lib/cloudflare';
import { tryCatch } from '@/utils/tryCatch';

export const MAX_FILE_SIZE_GALLERY = 8 * 1024 * 1024; // 8MB
export const MAX_FILE_SIZE_VIDEO = 20 * 1024 * 1024; // 20MB

const BUCKETS = z.enum(['escort-gallery', 'escort-videos']);

const GalleryUploadSchema = z.object({
	key: z.string().min(3),
	bucket: z.literal('escort-gallery'),
	file: z
		.file()
		.min(1)
		.max(MAX_FILE_SIZE_GALLERY)
		.mime(['image/png', 'image/jpeg']),
	cacheControl: z.string().default('no-cache, must-revalidate').optional(),
});

const VideoUploadSchema = z.object({
	key: z.string().min(3),
	bucket: z.literal('escort-videos'),
	file: z
		.file()
		.min(1)
		.max(MAX_FILE_SIZE_VIDEO)
		.mime(['video/mp4', 'video/quicktime', 'video/webm']),
	cacheControl: z.string().default('no-cache, must-revalidate').optional(),
});

const UploadInputSchema = z.union([GalleryUploadSchema, VideoUploadSchema]);

// Helper to build public R2 URL
const buildPublicUrl = (key: string): string => {
	// Use the public R2 URL you configured
	return `https://pub-d7999e94899e4c1ebdf7925e711f6b60.r2.dev/${key}`;
};

const UploadOutputSchema = z.object({
	key: z.string(),
	bucket: BUCKETS,
	url: z.string(),
});

const DeleteInputSchema = z.object({
	key: z.string().min(1),
	bucket: BUCKETS,
});

const DeleteOutputSchema = z.object({
	success: z.boolean(),
});

export const storageRoutes = {
	upload: authProcedure
		.input(UploadInputSchema)
		.output(UploadOutputSchema)
		.handler(async ({ input }) => {
			// 1. Upload to R2
			const ab = await input.file.arrayBuffer();
			const command = new PutObjectCommand({
				Bucket: input.bucket,
				Key: input.key,
				Body: new Uint8Array(ab),
				ContentType: input.file.type,
				CacheControl: input.cacheControl || 'no-cache, must-revalidate',
			});

			const [uploadErr] = await tryCatch(r2.send(command));
			if (uploadErr) throw uploadErr;

			// 2. Build public URL
			const publicUrl = buildPublicUrl(input.key);

			return {
				key: input.key,
				bucket: input.bucket,
				url: publicUrl,
			};
		}),
	delete: authProcedure
		.input(DeleteInputSchema)
		.output(DeleteOutputSchema)
		.handler(async ({ input }) => {
			// 1. Delete from R2
			const command = new DeleteObjectCommand({
				Bucket: input.bucket,
				Key: input.key,
			});

			const [deleteErr] = await tryCatch(r2.send(command));
			if (deleteErr) throw deleteErr;

			return { success: true };
		}),
};
