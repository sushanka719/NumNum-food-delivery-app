import { sdk } from "@/lib/medusa";
import { StorefrontProduct, StorefrontCategory, ProductVariant, ProductOption } from "./types";

const PREFERRED_CURRENCY = process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? "usd";

const PRODUCT_FIELDS =
  "*variants,*variants.prices,*variants.options,*options,*options.values,+categories,*images";

function resolvePrice(prices: any[]): number {
  if (!prices?.length) return 0;
  const preferred = prices.find((pr: any) => pr.currency_code === PREFERRED_CURRENCY);
  return (preferred ?? prices[0]).amount ?? 0;
}

function mapVariant(v: any, productOptions: any[]): ProductVariant {
  const optionMap: Record<string, string> = {};
  for (const ov of v.options ?? []) {
    // ov.option is embedded in the response — use it directly, fall back to lookup
    const title = ov.option?.title ?? productOptions.find((o: any) => o.id === ov.option_id)?.title;
    if (title) optionMap[title] = ov.value;
  }
  return {
    id: v.id,
    title: v.title,
    sku: v.sku ?? undefined,
    price: resolvePrice(v.prices ?? []),
    inStock: !v.manage_inventory || v.inventory_quantity == null || v.inventory_quantity > 0,
    options: optionMap,
  };
}

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

// Medusa file-local provider sometimes saves URLs without the /static/ prefix
// when the provider wasn't configured at upload time. Fix those URLs.
function fixImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) {
    try {
      const u = new URL(url);
      // If path doesn't start with /static/ and looks like a bare filename, prepend it
      if (!u.pathname.startsWith("/static/") && /^\/([\w.-]+\.(jpg|jpeg|png|webp|gif|avif))$/i.test(u.pathname)) {
        u.pathname = "/static" + u.pathname;
        return u.toString();
      }
    } catch {}
  }
  return url;
}

function mapProduct(p: any): StorefrontProduct {
  const rawOptions: any[] = p.options ?? [];
  const options: ProductOption[] = rawOptions.map((o: any) => ({
    id: o.id,
    title: o.title,
    values: (o.values ?? []).map((v: any) => v.value),
  }));

  const variants: ProductVariant[] = (p.variants ?? []).map((v: any) =>
    mapVariant(v, rawOptions)
  );

  const firstVariant = variants[0];

  return {
    id: p.id,
    name: p.title,
    slug: p.handle,
    price: firstVariant?.price ?? 0,
    images: p.images?.map((i: any) => fixImageUrl(i.url)).filter(Boolean) ?? (p.thumbnail ? [p.thumbnail] : []),
    image: fixImageUrl(p.thumbnail ?? p.images?.[0]?.url ?? ""),
    description: p.description ?? "",
    details: [],
    category: p.categories?.[0]?.name ?? "General",
    categorySlug: p.categories?.[0]?.handle,
    categoryId: p.categories?.[0]?.id,
    variantId: firstVariant?.id,
    inStock: variants.length === 0 || variants.some((v) => v.inStock),
    variants,
    options,
    featured: false,
    isNew: false,
    weight: p.weight ?? undefined,
    material: p.material ?? undefined,
  };
}

export async function getProducts(params?: {
  limit?: number;
  offset?: number;
  category_id?: string[];
}): Promise<{ products: StorefrontProduct[]; count: number }> {
  const response = await sdk.store.product.list({
    limit: params?.limit ?? 20,
    offset: params?.offset ?? 0,
    fields: PRODUCT_FIELDS,
    ...(params?.category_id ? { category_id: params.category_id } : {}),
  } as any);
  return {
    products: response.products.map(mapProduct),
    count: response.count ?? response.products.length,
  };
}

export async function getProductByHandle(
  handle: string
): Promise<StorefrontProduct | null> {
  const response = await sdk.store.product.list({
    handle,
    fields: PRODUCT_FIELDS,
  } as any);
  const p = response.products[0];
  return p ? mapProduct(p) : null;
}

export async function searchProducts(query: string): Promise<StorefrontProduct[]> {
  if (!query.trim()) return [];
  const response = await sdk.store.product.list({
    q: query,
    limit: 12,
    fields: PRODUCT_FIELDS,
  } as any);
  return response.products.map(mapProduct);
}

export async function getProductCategories(): Promise<StorefrontCategory[]> {
  try {
    const response = await sdk.store.category.list({ fields: "+metadata,+description" } as any);
    const cats: StorefrontCategory[] = (response.product_categories ?? []).map(
      (c: any) => ({
        name: c.name,
        slug: c.handle,
        id: c.id,
        image: c.metadata?.image ?? undefined,
        description: c.description ?? undefined,
      })
    );
    return [{ name: "All", slug: "all" }, ...cats];
  } catch {
    return [{ name: "All", slug: "all" }];
  }
}
