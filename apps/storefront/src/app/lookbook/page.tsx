import Image from "next/image";
import Link from "next/link";
import { getLookbooks } from "@/lib/data/lookbook";
import { blurDataURL } from "@/lib/image";

const FALLBACK_ITEMS = [
  {
    id: "1", title: "Winter Solstice", slug: "winter-solstice", published_at: null,
    subtitle: "A season of warmth", season: "Winter 2025",
    cover_image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "2", title: "Golden Hour", slug: "golden-hour", published_at: null,
    subtitle: "Light in the quiet", season: "Autumn 2025",
    cover_image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "3", title: "Still Life", slug: "still-life", published_at: null,
    subtitle: "Minimal, intentional", season: "Spring 2025",
    cover_image: "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "4", title: "Bloom", slug: "bloom", published_at: null,
    subtitle: "Fresh and luminous", season: "Summer 2025",
    cover_image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1600&auto=format&fit=crop",
  },
];

export const metadata = {
  title: "Lookbook | Aluna",
  description: "Explore our editorial lookbook — curated seasonal collections from Aluna.",
};

export default async function LookbookPage() {
  const items = await getLookbooks();
  const display = items.length > 0 ? items : FALLBACK_ITEMS;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="px-6 md:px-12 lg:px-16 py-16 lg:py-20 border-b border-[var(--card-border)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-4">
          Editorial
        </p>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-[var(--foreground)] leading-none">
          Look<span className="italic">book</span>
        </h1>
      </section>

      {/* Masonry-style grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--card-border)]">
        {display.map((item, index) => (
          <Link
            key={item.id}
            href={`/lookbook/${item.slug}`}
            className="group relative overflow-hidden border-b border-[var(--card-border)]"
            style={{ minHeight: index % 3 === 0 ? "600px" : "400px" }}
          >
            {item.cover_image && (
              <Image
                src={item.cover_image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            {/* Season badge */}
            <div className="absolute top-6 left-6">
              <span className="text-xs uppercase tracking-[0.3em] text-white/70 bg-black/30 backdrop-blur-sm px-3 py-1.5">
                {item.season ?? "Seasonal"}
              </span>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-none mb-2">
                {item.title}
              </h2>
              {item.subtitle && (
                <p className="text-sm text-white/70 italic mb-4">{item.subtitle}</p>
              )}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs uppercase tracking-[0.2em] text-white">Explore</span>
                <div className="h-px w-8 bg-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
