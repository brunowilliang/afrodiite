import { nanoid } from "nanoid";
import type { GalleryItem } from "./schemas/escort-core";

export function buildGalleryItems(list: Partial<GalleryItem>[]): GalleryItem[] {
  const now = new Date().toISOString();
  return list.map((item, i) => ({
    id: item.id || nanoid(6),
    path: item.path || "",
    url: item.url || "",
    size: item.size || 0,
    order: item.order ?? i,
    createdAt: item.createdAt || now,
  }));
}
