import { sdk } from "@/lib/medusa";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string; // e.g. "Shipping", "Returns", "Products"
  order?: number;
}

function parseBody(body: string | null): Record<string, any> {
  if (!body) return {};
  try { const p = JSON.parse(body); if (typeof p === "object" && p !== null) return p; } catch {}
  return {};
}

function mapItem(item: any): FaqItem {
  const meta = { ...parseBody(item.body), ...(item.metadata ?? {}) };
  return {
    id: item.id,
    question: item.title,
    answer: meta.answer ?? "",
    category: meta.category,
    order: meta.order ? Number(meta.order) : undefined,
  };
}

export async function getFaqItems(category?: string): Promise<FaqItem[]> {
  try {
    const response = await sdk.client.fetch<{ content_items: any[]; count: number }>(
      "/content/faq/items?limit=50"
    );
    let items = (response.content_items ?? []).map(mapItem);
    if (category) items = items.filter((i) => i.category === category);
    items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    return items;
  } catch {
    return [];
  }
}
