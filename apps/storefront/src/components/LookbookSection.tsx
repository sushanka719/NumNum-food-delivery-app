"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { blurDataURL } from "@/lib/image";
import type { LookbookItem } from "@/lib/data/lookbook";

const FALLBACK: LookbookItem[] = [
  {
    id: "1",
    title: "Winter Solstice",
    slug: "winter-solstice",
    published_at: null,
    subtitle: "A season of warmth",
    cover_image:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1200&auto=format&fit=crop",
    season: "Winter 2025",
    featured: true,
  },
  {
    id: "2",
    title: "Golden Hour",
    slug: "golden-hour",
    published_at: null,
    subtitle: "Light in the quiet",
    cover_image:
      "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?q=80&w=1200&auto=format&fit=crop",
    season: "Autumn 2025",
  },
  {
    id: "3",
    title: "Still Life",
    slug: "still-life",
    published_at: null,
    subtitle: "Minimal, intentional",
    cover_image:
      "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?q=80&w=1200&auto=format&fit=crop",
    season: "Spring 2025",
  },
];

export default function LookbookSection({ items }: { items: LookbookItem[] }) {
  const display = items.length > 0 ? items.slice(0, 3) : FALLBACK;
  const [featured, ...rest] = display;

  return (
    <section className="border-b border-[var(--card-border)]">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between px-6 md:px-12 lg:px-16 py-12 border-b border-[var(--card-border)]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-3">
            Editorial
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">
            Lookbook
          </h2>
        </div>
        <Link
          href="/lookbook"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--foreground)] hover:text-[var(--text-secondary)] transition-colors group"
        >
          View All
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid: featured large left + 2 smaller right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--card-border)]">
        {/* Featured */}
        {featured && (
          <Link href={`/lookbook/${featured.slug}`} className="group block relative overflow-hidden min-h-[500px]">
            {featured.cover_image && (
              <Image
                src={featured.cover_image}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
                {featured.season ?? "Featured"}
              </p>
              <h3 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-1">
                {featured.title}
              </h3>
              {featured.subtitle && (
                <p className="text-sm text-white/70 italic">{featured.subtitle}</p>
              )}
            </div>
          </Link>
        )}

        {/* Right: stacked two */}
        <div className="flex flex-col divide-y divide-[var(--card-border)]">
          {rest.map((item) => (
            <Link
              key={item.id}
              href={`/lookbook/${item.slug}`}
              className="group relative overflow-hidden min-h-[250px] flex-1"
            >
              {item.cover_image && (
                <Image
                  src={item.cover_image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-1">
                  {item.season ?? ""}
                </p>
                <h3 className="text-2xl font-serif text-white">{item.title}</h3>
                {item.subtitle && (
                  <p className="text-xs text-white/60 mt-1 italic">{item.subtitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
