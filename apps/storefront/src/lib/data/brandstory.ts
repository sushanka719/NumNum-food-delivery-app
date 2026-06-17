import { sdk } from "@/lib/medusa";

export interface BrandStorySection {
  id: string;
  key: string; // e.g. "hero", "journey", "values", "team"
  title?: string;
  subtitle?: string;
  body?: string;
  image?: string;
  cta_label?: string;
  cta_link?: string;
  order?: number;
}

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

export interface BrandValue {
  title: string;
  description: string;
  icon?: string;
}

export interface BrandStory {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  journeyTitle?: string;
  journeyParagraphs?: string[];
  journeyImage?: string;
  values?: BrandValue[];
  team?: TeamMember[];
  statsHeadline?: string;
}

function parseBody(body: string | null): Record<string, any> {
  if (!body) return {};
  try { const p = JSON.parse(body); if (typeof p === "object" && p !== null) return p; } catch {}
  return {};
}

function mapBrandStory(items: any[]): BrandStory {
  const story: BrandStory = {};

  for (const item of items) {
    const meta = { ...parseBody(item.body), ...(item.metadata ?? {}) };
    const key: string = meta.key ?? item.slug ?? "";

    if (key === "hero") {
      story.heroTitle = item.title;
      story.heroSubtitle = meta.subtitle ?? item.body;
      story.heroImage = meta.image;
    } else if (key === "journey") {
      story.journeyTitle = item.title;
      const raw: string = meta.body ?? item.body ?? "";
      story.journeyParagraphs = raw.split("\n\n").filter(Boolean);
      story.journeyImage = meta.image;
    } else if (key === "values") {
      try {
        story.values = Array.isArray(meta.values)
          ? meta.values
          : JSON.parse(meta.values ?? "[]");
      } catch {
        story.values = [];
      }
    } else if (key === "team") {
      try {
        story.team = Array.isArray(meta.team)
          ? meta.team
          : JSON.parse(meta.team ?? "[]");
      } catch {
        story.team = [];
      }
    }
  }

  return story;
}

export async function getBrandStory(): Promise<BrandStory | null> {
  try {
    const response = await sdk.client.fetch<{ content_items: any[]; count: number }>(
      "/content/brand-story/items?limit=20"
    );
    const items = response.content_items ?? [];
    if (items.length === 0) return null;
    return mapBrandStory(items);
  } catch {
    return null;
  }
}
