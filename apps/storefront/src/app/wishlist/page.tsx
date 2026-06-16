"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { blurDataURL } from "@/lib/image";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem } = useWishlistStore();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--card-border)] px-6 md:px-12 lg:px-24 py-12">
        <div className="flex items-center gap-3 mb-2">
          <Heart size={20} strokeWidth={1.5} className="text-[var(--foreground)]" />
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">Wishlist</h1>
        </div>
        <p className="text-[var(--text-secondary)] text-sm">
          {items.length === 0 ? "Your wishlist is empty" : `${items.length} saved item${items.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <Heart size={48} strokeWidth={1} className="text-[var(--card-border)] mb-6" />
          <p className="text-[var(--text-secondary)] mb-8 text-sm uppercase tracking-[0.15em]">
            Nothing saved yet
          </p>
          <Link
            href="/shop"
            className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--foreground)] border border-[var(--foreground)] px-8 py-4 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
          >
            Browse Shop <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="px-6 md:px-12 lg:px-24 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="group flex flex-col"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[var(--section-bg)] mb-4">
                    <Link href={`/product/${item.slug}`}>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          placeholder="blur"
                          blurDataURL={blurDataURL}
                        />
                      ) : (
                        <div className="w-full h-full bg-[var(--section-bg)]" />
                      )}
                    </Link>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove from wishlist"
                      className="absolute top-3 right-3 p-1.5 bg-[var(--background)] border border-[var(--card-border)] opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
                    >
                      <X size={14} strokeWidth={1.5} className="text-[var(--foreground)]" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col gap-1 mb-3">
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="font-serif text-base text-[var(--foreground)] leading-tight hover:text-[var(--text-secondary)] transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* View product to select variant + add to cart */}
                  <Link
                    href={`/product/${item.slug}`}
                    className="w-full py-3 border border-[var(--foreground)] text-xs uppercase tracking-[0.2em] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} />
                    View Product
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Continue shopping */}
          <div className="mt-16 pt-8 border-t border-[var(--card-border)] flex justify-between items-center">
            <Link
              href="/shop"
              className="text-sm uppercase tracking-[0.15em] text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors flex items-center gap-2"
            >
              <ArrowRight size={14} className="rotate-180" /> Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
