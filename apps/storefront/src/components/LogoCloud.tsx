import Image from "next/image";
import Link from "next/link";
import { getPressItems, type PressItem } from "@/lib/data/press";
import { blurDataURL } from "@/lib/image";

const FALLBACK: PressItem[] = [
  { id: "1", title: "Vogue", slug: "vogue", published_at: null, logo_text: "VOGUE" },
  { id: "2", title: "Elle", slug: "elle", published_at: null, logo_text: "ELLE" },
  { id: "3", title: "Harper's Bazaar", slug: "bazaar", published_at: null, logo_text: "BAZAAR" },
  { id: "4", title: "Cosmopolitan", slug: "cosmo", published_at: null, logo_text: "COSMO" },
  { id: "5", title: "Marie Claire", slug: "marie-claire", published_at: null, logo_text: "MARIE CLAIRE" },
  { id: "6", title: "Glamour", slug: "glamour", published_at: null, logo_text: "GLAMOUR" },
];

export default async function LogoCloud() {
  const items = await getPressItems();
  const brands = items.length > 0 ? items : FALLBACK;

  // Find brands that have a quote to feature
  const featured = brands.filter((b) => b.quote).slice(0, 1)[0];

  return (
    <section className="bg-[var(--background)] border-b border-[var(--card-border)]">
      <div className="border-b border-[var(--card-border)] px-8 md:px-12 lg:px-24 py-12 text-center">
        <p className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em]">As Featured In</p>
      </div>

      {/* Logo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y lg:divide-y-0 divide-[var(--card-border)]">
        {brands.map((brand) => {
          const inner = brand.logo ? (
            <div className="relative w-24 h-8">
              <Image
                src={brand.logo}
                alt={brand.title}
                fill
                sizes="96px"
                className="object-contain opacity-40 hover:opacity-100 transition-opacity"
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
            </div>
          ) : (
            <span className="text-xl md:text-2xl font-serif font-bold text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors cursor-default italic">
              {brand.logo_text}
            </span>
          );

          return (
            <div
              key={brand.id}
              className="flex items-center justify-center p-8 md:p-10 hover:bg-[var(--card-bg)] transition-colors"
            >
              {brand.link ? (
                <Link href={brand.link} target="_blank" rel="noopener noreferrer">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>

      {/* Featured quote — shown only when a brand has a quote in CMS */}
      {featured && (
        <div className="border-t border-[var(--card-border)] px-6 md:px-12 lg:px-24 py-12 text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic text-[var(--foreground)] max-w-3xl mx-auto leading-relaxed">
            &ldquo;{featured.quote}&rdquo;
          </blockquote>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)] mt-6">
            — {featured.title}
          </p>
        </div>
      )}
    </section>
  );
}
