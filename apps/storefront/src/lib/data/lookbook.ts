import { sdk } from "@/lib/medusa";

export interface LookbookItem {
  id: string;
  title: string;
  slug: string;
  published_at: string | null;
  subtitle?: string;
  description?: string;
  cover_image?: string;
  images?: string[]; // additional gallery images stored as JSON array in metadata
  season?: string;
  linked_product_handles?: string[]; // product handles to link
  featured?: boolean;
}

function parseBody(body: string | null): Record<string, any> {
  if (!body) return {};
  try {
    const parsed = JSON.parse(body);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) return parsed;
  } catch {}
  return {};
}

function mapItem(item: any): LookbookItem {
  // Plugin stores JSON data in body field; metadata field may also be used
  const meta = { ...parseBody(item.body), ...(item.metadata ?? {}) };

  let images: string[] = [];
  try {
    images = Array.isArray(meta.images) ? meta.images : JSON.parse(meta.images ?? "[]");
  } catch {
    images = [];
  }
  let linked_product_handles: string[] = [];
  try {
    linked_product_handles = Array.isArray(meta.linked_product_handles)
      ? meta.linked_product_handles
      : JSON.parse(meta.linked_product_handles ?? "[]");
  } catch {
    linked_product_handles = [];
  }

  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    published_at: item.published_at ?? null,
    subtitle: meta.subtitle,
    description: meta.description ?? null,
    cover_image: meta.cover_image,
    images,
    season: meta.season,
    linked_product_handles,
    featured: meta.featured === true || meta.featured === "true",
  };
}

export async function getLookbooks(): Promise<LookbookItem[]> {
  try {
    const response = await sdk.client.fetch<{ content_items: any[]; count: number }>(
      "/content/lookbooks/items?limit=50"
    );
    return (response.content_items ?? []).map(mapItem);
  } catch {
    return [];
  }
}

export async function getLookbook(slug: string): Promise<LookbookItem | null> {
  try {
    const response = await sdk.client.fetch<{ content_item: any }>(
      `/content/lookbooks/items/${slug}`
    );
    return response.content_item ? mapItem(response.content_item) : null;
  } catch {
    return null;
  }
}
