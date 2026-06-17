import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLookbook, getLookbooks } from "@/lib/data/lookbook";
import { getProducts } from "@/lib/data/products";
import ProductCard from "@/components/ProductCard";
import { blurDataURL } from "@/lib/image";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const items = await getLookbooks();
  return items.map((item) => ({ slug: item.slug }));
}

export default async function LookbookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getLookbook(slug);
  if (!item) notFound();

  const allImages = [
    ...(item.cover_image ? [item.cover_image] : []),
    ...(item.images ?? []),
  ];

  // Fetch linked products if any
  let linkedProducts: any[] = [];
  if (item.linked_product_handles && item.linked_product_handles.length > 0) {
    const { products } = await getProducts({ limit: 8 });
    linkedProducts = products.filter((p) =>
      item.linked_product_handles!.includes(p.slug)
    );
  }

  return (
    <div className="flex flex-col">
      {/* Back nav */}
      <div className="px-6 md:px-12 lg:px-16 py-6 border-b border-[var(--card-border)]">
        <Link
          href="/lookbook"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft size={14} />
          All Lookbooks
        </Link>
      </div>

      {/* Hero */}
      <section className="relative min-h-[80vh] overflow-hidden border-b border-[var(--card-border)]">
        {allImages[0] && (
          <Image
            src={allImages[0]}
            alt={item.title}
            fill
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={blurDataURL}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end h-full min-h-[80vh] px-6 md:px-12 lg:px-16 pb-16">
          {item.season && (
            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-4">
              {item.season}
            </p>
          )}
          <h1 className="text-6xl md:text-7xl lg:text-9xl font-serif text-white leading-none mb-4">
            {item.title}
          </h1>
          {item.subtitle && (
            <p className="text-xl text-white/70 italic">{item.subtitle}</p>
          )}
        </div>
      </section>

      {/* Description */}
      {item.description && (
        <section className="flex flex-col lg:flex-row border-b border-[var(--card-border)]">
          <div className="w-full lg:w-1/3 px-6 md:px-12 lg:px-16 py-16 border-b lg:border-b-0 lg:border-r border-[var(--card-border)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              The Story
            </p>
          </div>
          <div className="w-full lg:w-2/3 px-6 md:px-12 lg:px-16 py-16">
            <p className="text-xl md:text-2xl font-serif text-[var(--foreground)] leading-relaxed max-w-2xl">
              {item.description}
            </p>
          </div>
        </section>
      )}

      {/* Gallery grid */}
      {allImages.length > 1 && (
        <section className="border-b border-[var(--card-border)]">
          <div className="px-6 md:px-12 lg:px-16 py-12 border-b border-[var(--card-border)]">
            <h2 className="text-2xl font-serif text-[var(--foreground)]">Gallery</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-[var(--card-border)]">
            {allImages.slice(1).map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden group">
                <Image
                  src={img}
                  alt={`${item.title} ${i + 2}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shop the look */}
      {linkedProducts.length > 0 && (
        <section className="border-b border-[var(--card-border)]">
          <div className="px-6 md:px-12 lg:px-16 py-12 border-b border-[var(--card-border)]">
            <h2 className="text-2xl md:text-3xl font-serif text-[var(--foreground)]">
              Shop the Look
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-[var(--card-border)]">
            {linkedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
