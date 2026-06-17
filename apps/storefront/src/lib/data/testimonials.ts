import { sdk } from "@/lib/medusa";

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  rating: number;
  text: string;
  avatar?: string;
  verified?: boolean;
}

function parseBody(body: string | null): Record<string, any> {
  if (!body) return {};
  try { const p = JSON.parse(body); if (typeof p === "object" && p !== null) return p; } catch {}
  return {};
}

function mapItem(item: any): Testimonial {
  const meta = { ...parseBody(item.body), ...(item.metadata ?? {}) };
  return {
    id: item.id,
    name: item.title,
    location: meta.location,
    rating: meta.rating ? Number(meta.rating) : 5,
    text: meta.text ?? item.body ?? "",
    avatar: meta.avatar,
    verified: meta.verified === true || meta.verified === "true",
  };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await sdk.client.fetch<{ content_items: any[]; count: number }>(
      "/content/testimonials/items?limit=20"
    );
    return (response.content_items ?? []).map(mapItem);
  } catch {
    return [];
  }
}
