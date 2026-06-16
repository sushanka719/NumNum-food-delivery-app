"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { StorefrontProduct } from "@/lib/data/types";
import { blurDataURL } from "@/lib/image";
import { useWishlistStore } from "@/store/wishlist";

interface ProductCardProps {
  product: StorefrontProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleItem, isWishlisted } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const wishlisted = mounted && isWishlisted(product.id ?? product.slug);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: product.id ?? product.slug,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="group cursor-pointer h-full flex flex-col"
    >
      <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--background)] mb-6">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              placeholder="blur"
              blurDataURL={blurDataURL}
              priority={index < 4}
            />
          ) : (
            <div className="w-full h-full bg-[var(--section-bg)]" />
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 p-2 bg-[var(--background)] border border-[var(--card-border)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 active:scale-95 transition-transform"
          >
            <Heart
              size={16}
              strokeWidth={1.5}
              className={wishlisted ? "fill-current text-[var(--foreground)]" : "text-[var(--foreground)]"}
            />
          </button>
        </div>

        <div className="flex justify-between items-start gap-4">
          <h3 className="font-serif text-lg text-[var(--foreground)] leading-tight group-hover:text-[var(--text-secondary)] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-[var(--foreground)] tracking-wide whitespace-nowrap">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
