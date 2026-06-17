import { sdk } from "@/lib/medusa";

export interface PressItem {
  id: string;
  title: string; // publication name
  slug: string;
  published_at: string | null;
  logo?: string;    // URL to publication logo image
  logo_text?: string; // fallback text logo (e.g. "VOGUE")
  quote?: string;
  link?: string;
  date?: string;
}

function parseBody(body: string | null): Record<string, any> {
  if (!body) return {};
  try { const p = JSON.parse(body); if (typeof p === "object" && p !== null) return p; } catch {}
  return {};
}

function mapItem(item: any): PressItem {
  const meta = { ...parseBody(item.body), ...(item.metadata ?? {}) };
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    published_at: item.published_at ?? null,
    logo: meta.logo,
    logo_text: meta.logo_text ?? item.title,
    quote: meta.quote,
    link: meta.link,
    date: meta.date,
  };
}

export async function getPressItems(): Promise<PressItem[]> {
  try {
    const response = await sdk.client.fetch<{ content_items: any[]; count: number }>(
      "/content/press/items?limit=50"
    );
    return (response.content_items ?? []).map(mapItem);
  } catch {
    return [];
  }
}
