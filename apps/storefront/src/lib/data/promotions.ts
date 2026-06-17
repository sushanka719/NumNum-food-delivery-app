import { sdk } from "@/lib/medusa";

export interface Promotion {
  id: string;
  title: string;
  slug: string;
  published_at: string | null;
  headline?: string;
  subheadline?: string;
  body_text?: string;
  cta_label?: string;
  cta_link?: string;
  background_image?: string;
  badge_text?: string;
  badge_season?: string;
  active_from?: string;
  active_until?: string;
}

function parseBody(body: string | null): Record<string, any> {
  if (!body) return {};
  try { const p = JSON.parse(body); if (typeof p === "object" && p !== null) return p; } catch {}
  return {};
}

async function resolveHeroImage(meta: Record<string, any>): Promise<string | undefined> {
  // If explicit URL set, use it directly
  if (meta.background_image) return meta.background_image;

  // If references an image gallery collection item, fetch it
  const gallerySlug: string | undefined = meta.hero_image_collection;
  const imageSlug: string | undefined = meta.hero_image_slug;
  if (!gallerySlug) return undefined;

  try {
    const path = imageSlug
      ? `/content/${gallerySlug}/items/${imageSlug}`
      : `/content/${gallerySlug}/items?limit=1`;

    if (imageSlug) {
      const res = await sdk.client.fetch<{ content_item: any }>(path);
      const imgMeta = parseBody(res.content_item?.body);
      return imgMeta.image_url ?? res.content_item?.image ?? undefined;
    } else {
      const res = await sdk.client.fetch<{ content_items: any[] }>(path);
      const first = res.content_items?.[0];
      if (!first) return undefined;
      const imgMeta = parseBody(first.body);
      return imgMeta.image_url ?? first.image ?? undefined;
    }
  } catch {
    return undefined;
  }
}

function isActive(promo: Promotion): boolean {
  const now = new Date();
  if (promo.active_from && new Date(promo.active_from) > now) return false;
  if (promo.active_until && new Date(promo.active_until) < now) return false;
  return true;
}

export async function getActivePromotion(): Promise<Promotion | null> {
  try {
    const response = await sdk.client.fetch<{ content_items: any[]; count: number }>(
      "/content/promotions/items?limit=20"
    );
    const rawItems = response.content_items ?? [];

    const promotions = await Promise.all(
      rawItems.map(async (item) => {
        const meta = { ...parseBody(item.body), ...(item.metadata ?? {}) };
        const background_image = await resolveHeroImage(meta);
        const promo: Promotion = {
          id: item.id,
          title: item.title,
          slug: item.slug,
          published_at: item.published_at ?? null,
          headline: meta.headline ?? item.title,
          subheadline: meta.subheadline,
          body_text: meta.body_text,
          cta_label: meta.cta_label ?? "Explore Collection",
          cta_link: meta.cta_link ?? "/shop",
          background_image,
          badge_text: meta.badge_text,
          badge_season: meta.badge_season,
          active_from: meta.active_from,
          active_until: meta.active_until,
        };
        return promo;
      })
    );

    const active = promotions.filter(isActive);
    return active[0] ?? null;
  } catch {
    return null;
  }
}
